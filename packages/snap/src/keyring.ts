import type {
    Balance,
    CaipAssetType,
    CaipAssetTypeOrId,
    CaipChainId,
    DiscoveredAccount,
    EntropySourceId,
    Keyring,
    KeyringAccount,
    KeyringAccountData,
    KeyringEventPayload,
    KeyringRequest,
    Paginated,
    Pagination,
    SubmitRequestResponse,
    Transaction
} from '@metamask/keyring-api';

import {
    Address,
    toChecksumAddress,
    isValidPrivate,
    addHexPrefix,
    hashPersonalMessage,
} from '@ethereumjs/util';

import {
    EthAccountType,
    KeyringEvent,
    EthMethod,
} from '@metamask/keyring-api';

import {
    isUniqueAddress,
    runSensitive,
    throwError
} from './util';
import {
    emitSnapKeyringEvent
} from '@metamask/keyring-snap-sdk';

import { Json } from '@metamask/utils';
import { v4 as uuid } from 'uuid';
import { saveState } from './state';
import { encodeMessage } from './encoding';
import { getSignature } from './signing';
import { callVSLMethod } from './vsl';

export type KeyringState = {
    wallets: Record<string, Wallet>;
    pendingRequests: Record<string, KeyringRequest>;
    useSyncApprovals: boolean;
};

export type Wallet = {
    account: KeyringAccount;
    privateKey: string;
    nonce: string;
};

export class VSLKeyring implements Keyring {
    #state: KeyringState;

    constructor(state: KeyringState) {
        this.#state = state;
    }

    async listAccounts(): Promise<KeyringAccount[]> {
        return Object.values(this.#state.wallets).map((wallet) => wallet.account);
    }

    async getAccount(id: string): Promise<KeyringAccount | undefined> {
        return this.#state.wallets[id]?.account;
    }

    async getWallet(id: string): Promise<Wallet | undefined> {
        return this.#state.wallets[id];
    }

    async incrementNonce(id: string): Promise<boolean> {
        const wallet = this.#state.wallets[id];
        if (wallet === undefined) {
            return false;
        }
        wallet.nonce = String(BigInt(wallet.nonce) + 1n);

        this.#saveState('Failed to increment nonce');
        return true;
    }

    async createAccount(options: Record<string, Json> = {}): Promise<KeyringAccount> {
        const { privateKey, address } = this.#getKeyPair(
            options?.privateKey as string | undefined,
        );

        if (!isUniqueAddress(address, Object.values(this.#state.wallets))) {
            throwError(`Account address already in use: ${address}`);
        }

        // Private key must not be exposed to the metamask
        if (options?.privateKey) {
            delete options.privateKey;
        }

        const accountId = uuid();
        const account: KeyringAccount = {
            id: accountId,
            options,
            address,
            methods: [
                EthMethod.PersonalSign,
                EthMethod.SignTypedDataV4,
            ],
            scopes: ['eip155:0'],
            type: EthAccountType.Eoa,
        };

        let nonce: string;
        try {
            nonce = await callVSLMethod('vsl_getAccountNonce', {
                account_id: address,
            })
        } catch (err) {
            throwError(`Cannot retrieve VSL Account nonces: ${(err as Error).message}`);
        }

        // Create the VSL account in the core.
        await this.#emitEvent(KeyringEvent.AccountCreated, {
            account,
            accountNameSuggestion: "VSL Account",
        }, "Account creation event failed to emit to the MetaMask")

        // Save the account to the snap state.
        this.#state.wallets[account.id] = {
            account,
            privateKey,
            nonce,
        };
        await this.#saveState(
            'Failed to save new account state, if you see this message, ' +
            'Please remove the created account in the MetaMask panel and try again.',
        );

        return account;
    }

    async listAccountAssets(id: string): Promise<CaipAssetTypeOrId[]> {
        throwError("Not implemented: listAccountAssets");
    }

    async listAccountTransactions(id: string, pagination: Pagination): Promise<Paginated<Transaction>> {
        throwError("Not implemented: listAccountTransactions");
    }

    async discoverAccounts(scopes: CaipChainId[], entropySource: EntropySourceId, groupIndex: number): Promise<DiscoveredAccount[]> {
        throwError("Not implemented: discoverAccounts");
    }

    async getAccountBalances(id: string, assets: CaipAssetType[]): Promise<Record<CaipAssetType, Balance>> {
        throwError("Not implemented: getAccountBalances");
    }

    async exportAccount(id: string): Promise<KeyringAccountData> {
        const wallet = await this.getWallet(id);

        if (!wallet) {
            throwError(`Account '${id}' not found`);
        }

        return {
            account: wallet.account,
            privateKey: wallet.privateKey,
            nonce: wallet.nonce.toString(),
        }
    }

    async filterAccountChains(id: string, chains: string[]): Promise<string[]> {
        return chains.filter((chain) => chain.startsWith('vsl:'));
    }

    async updateAccount(account: KeyringAccount): Promise<void> {
        const wallet = await this.getWallet(account.id);
        if (wallet === undefined) return;

        const newAccount: KeyringAccount = {
            ...wallet.account,
            options: account.options
        };

        await this.#emitEvent(KeyringEvent.AccountUpdated, {
            account: newAccount,
        }, "Account update event failed to emit to the MetaMask");

        wallet.account = newAccount;
        await this.#saveState(
            'Failed to update account state, if you see this message, ' +
            'Please try again.',
        )
    }

    async deleteAccount(id: string): Promise<void> {
        const wallet = await this.getWallet(id);
        if (wallet === undefined) {
            throwError(`Account '${id}' not found`);
        }

        await this.#emitEvent(KeyringEvent.AccountDeleted, {
            id
        }, "Account deletion event failed to emit to the MetaMask");

        delete this.#state.wallets[id];
        await this.#saveState(
            'Failed to delete account state, if you see this message, ' +
            'Please try again.',
        );
    }

    // TODO! Also implement async request
    async submitRequest(request: KeyringRequest): Promise<SubmitRequestResponse> {
        return this.#syncSubmitRequest(request);
    }

    getWalletByAddress(address: string): Wallet | undefined {
        const match = Object.values(this.#state.wallets).find((wallet) =>
            wallet.account.address.toLowerCase() === address.toLowerCase(),
        );

        return match ?? throwError(`Account '${address}' not found`);
    }

    async #syncSubmitRequest(request: KeyringRequest): Promise<SubmitRequestResponse> {
        const { method, params = [] } = request.request;

        const wallet = await this.getWallet(request.account);

        if (wallet === undefined) {
            throw new Error(`Wallet with id '${request.account}' not found`);
        }

        const result = await this.#handleSigningRequest(wallet, method, params);
        return {
            pending: false,
            result
        };
    }

    // dispatch function
    async #handleSigningRequest(
        wallet: Wallet,
        method: string,
        params: Record<string, Json> | Json[],
    ): Promise<Json> {
        switch (method) {
            // TODO!: Implement these signing methods
            case EthMethod.PersonalSign:
                return await this.#PersonalSign(
                    (params as Json[])[0] as string,
                    (params as Json[])[1] as string,
                )
            default:
                throwError(`Method '${method}' not supported`);
        }
    }

    #PersonalSign(
        message: string,
        address: string,
    ): string {
        const wallet = this.getWalletByAddress(address);
        if (!wallet) {
            throw new Error(`Wallet with address '${address}' not found`);
        }

        const encodedMessage = encodeMessage(message);

        const hash = hashPersonalMessage(Buffer.from(encodedMessage));
        const { v, r, s } = getSignature(wallet.privateKey, hash);

        const combinedBuffer = Buffer.concat([
            r, s,
            Buffer.from([Number(v)]),
        ]);

        const signature = addHexPrefix(combinedBuffer.toString('hex'));
        return signature;
    }

    #getKeyPair(privateKey?: string): {
        privateKey: string;
        address: string;
    } {
        const privateKeyBuffer: Buffer = runSensitive(() =>
            privateKey
                ? Buffer.from(privateKey, 'hex')
                : Buffer.from(crypto.getRandomValues(new Uint8Array(32))),
            'Invalid private key',
        );

        if (!isValidPrivate(privateKeyBuffer)) {
            throw new Error('Invalid private key');
        }

        const address = toChecksumAddress(
            Address.fromPrivateKey(privateKeyBuffer).toString(),
        );
        return { privateKey: privateKeyBuffer.toString('hex'), address };
    }

    async #saveState(error: string): Promise<void> {
        try {
            await saveState(this.#state);
        } catch (err) {
            throwError(error)
        }
    }

    async #emitEvent(
        event: KeyringEvent,
        data: KeyringEventPayload<KeyringEvent>,
        error: string
    ): Promise<void> {
        try {
            await emitSnapKeyringEvent(snap, event, data);
        } catch (err) {
            throwError(`${error}: ${(err as Error).message}`);
        }
    }
}
