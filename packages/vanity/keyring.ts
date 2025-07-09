import { v4 as uuid } from 'uuid';

import { Json } from '@metamask/utils';
import {
    EthAccountType,
    EthMethod,
    Keyring,
    KeyringAccount,
    KeyringRequest,
    SubmitRequestResponse,
} from '@metamask/keyring-api';

import {
    Address,
    addHexPrefix,
    hashPersonalMessage,
    isValidPrivate,
    toChecksumAddress,
} from '@ethereumjs/util';

import {
    encodeMessage,
    getSignature,
    isUniqueAddress,
    runSensitive,
    VSLCaller,
    VSLKeyring,
} from 'vsl-snap-util';

import { VanityKeyringRaiser } from './error';

export type KeyringState = {
    wallets: Record<string, VanityWallet>;
    pendingRequests: Record<string, KeyringRequest>;
    useSyncApprovals: boolean;
};

export type VanityWallet = {
    account: KeyringAccount;
    privateKey: string;
    nonce: string;
};

export class VanityKeyring implements Keyring, VSLKeyring {
    #state: KeyringState;
    #raiser: VanityKeyringRaiser;
    #vslCaller: VSLCaller;

    constructor(state: KeyringState, raiser: any, vslCaller: VSLCaller) {
        this.#state = state;
        this.#raiser = raiser;
        this.#vslCaller = vslCaller;
    }

    async listAccounts(): Promise<KeyringAccount[]> {
        return Object.values(this.#state.wallets).map((wallet) => wallet.account);
    }

    async getAccount(id: string): Promise<KeyringAccount | undefined> {
        return this.#state.wallets[id]?.account;
    }

    async getWallet(id: string): Promise<VanityWallet | undefined> {
        return this.#state.wallets[id];
    }

    async incrementNonce(id: string): Promise<boolean> {
        const wallet = this.#state.wallets[id];
        if (wallet === undefined) {
            return false;
        }
        wallet.nonce = String(BigInt(wallet.nonce) + 1n);

        return true;
    }

    async createAccount(options: Record<string, Json> = {}): Promise<KeyringAccount> {
        const { privateKey, address } = this.#getKeyPair(
            options?.privateKey as string | undefined,
        );

        if (!isUniqueAddress(address, Object.values(this.#state.wallets))) {
            return this.#raiser.duplicateAddress(address);
        }

        // Peel off the private key from options
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

        let nonce: string = await this.#vslCaller.call('vsl_getAccountNonce', {
            account_id: address,
        })

        // Save the account to the vanity state.
        this.#state.wallets[account.id] = {
            account,
            privateKey,
            nonce,
        };

        return account;
    }

    async exportAccount(id: string): Promise<VanityWallet> {
        const wallet = await this.getWallet(id);
        if (wallet === undefined) {
            return this.#raiser.accountNotFound(id)
        }

        return wallet;
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

        wallet.account = newAccount;
    }

    async deleteAccount(id: string): Promise<void> {
        const wallet = await this.getWallet(id);
        if (wallet === undefined) {
            return this.#raiser.accountNotFound(id);
        }

        delete this.#state.wallets[id];
    }

    // TODO! Also implement async request
    async submitRequest(request: KeyringRequest): Promise<SubmitRequestResponse> {
        return this.#syncSubmitRequest(request);
    }

    getWalletByAddress(address: string): VanityWallet {
        const match = Object.values(this.#state.wallets).find((wallet) =>
            wallet.account.address.toLowerCase() === address.toLowerCase(),
        );

        return match ?? this.#raiser.accountNotFound(address);
    }

    async #syncSubmitRequest(request: KeyringRequest): Promise<SubmitRequestResponse> {
        const { method, params = [] } = request.request;

        const wallet = await this.getWallet(request.account);
        if (wallet === undefined) {
            return this.#raiser.accountNotFound(request.account);
        }

        const result = await this.#handleSigningRequest(wallet, method, params);
        return {
            pending: false,
            result
        };
    }

    // dispatch function
    async #handleSigningRequest(
        wallet: VanityWallet,
        method: string,
        params: Record<string, Json> | Json[],
    ): Promise<Json> {
        switch (method) {
            // TODO!: Implement these signing methods
            case EthMethod.PersonalSign:
                return this.#PersonalSign(
                    (params as Json[])[0] as string,
                    (params as Json[])[1] as string,
                )
            default:
                return this.#raiser.invalidRequestMethod(method);
        }
    }

    #PersonalSign(
        message: string,
        address: string,
    ): string {
        const wallet = this.getWalletByAddress(address);
        if (!wallet) {
            return this.#raiser.accountNotFound(address);
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
            this.#raiser.invalidPrivateKey();
        }

        const address = toChecksumAddress(
            Address.fromPrivateKey(privateKeyBuffer).toString(),
        );

        return { privateKey: privateKeyBuffer.toString('hex'), address };
    }
}