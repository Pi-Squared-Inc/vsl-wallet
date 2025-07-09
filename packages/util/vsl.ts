import { v4 as uuid } from 'uuid';
import { z } from 'zod/v4';
import { signMessage } from './util/signing';
import { stringify } from './util/util';
import { VSLMethodEnum } from './schema/vsl/schema';
import { VSLMethodConfig } from './schema/vsl/config';
import { VSLRaiser } from 'util/error';

export type VSLWallet = {
    privateKey: string;
    nonce: string;
}

export type VSLKeyring = {
    exportAccount: (accountId: string) => Promise<VSLWallet>;
    incrementNonce: (accountId: string) => void;
}

export class VSLCaller {
    #raiser: VSLRaiser
    constructor(raiser: any) {
        this.#raiser = raiser;
    }

    async call(
        method     : VSLMethodEnum,
        params     : any,
        keyring   ?: VSLKeyring,
        accountId ?: string,
    ): Promise<any> {
        const config = VSLMethodConfig[method];

        const result = config.signed[0] === false
            ? await this.#callUnsigned(method, params)
            : await this.#callSigned(
                method, params,
                keyring ?? this.#raiser.missingKeyring(method),
                accountId ?? this.#raiser.missingAccountId(method),
            );

        const parsedResult = config.return.safeParse(result);
        if (!parsedResult.success) {
            return this.#raiser.invalidReturn(method, parsedResult.error.issues);
        }

        return parsedResult.data;
    }

    async #callUnsigned(
        method : VSLMethodEnum,
        params : any,
    ) {
        const parsedParams = VSLMethodConfig[method].params.safeParse(params);
        if (!parsedParams.success) {
            return this.#raiser.invalidParams(method, parsedParams.error.issues);
        }

        return this.#sendRequest(method, parsedParams.data);
    }

    async #callSigned(
        method    : VSLMethodEnum,
        params    : z.infer<typeof VSLMethodConfig[typeof method]['params']>,
        keyring   : VSLKeyring,
        accountId : string,
    ) {
        const wallet = await keyring.exportAccount(accountId);

        const wrapper = VSLMethodConfig[method]?.signed[1] as string | undefined;
        if (wrapper === undefined) {
            return this.#raiser.missingWrapperName(method);
        }

        const parsedParams = VSLMethodConfig[method].params.safeParse({
            ...params,
            nonce: wallet.nonce,
        })

        if (!parsedParams.success) {
            return this.#raiser.invalidParams(method, parsedParams.error.issues);
        }

        const signedParams = {
            [wrapper] : signMessage(wallet.privateKey, parsedParams.data),
        }

        const result = await this.#sendRequest(method, signedParams);

        // this should never failed
        keyring.incrementNonce(accountId);

        return result;
    }

    async #sendRequest(
        method: VSLMethodEnum,
        params: object,
    ): Promise<any> {
        const requestBody = this.#createRequest(method, params);

        const response = await fetch(process.env.VSL_ENDPOINT!, requestBody);
        if (!response.ok) {
            return this.#raiser.requestFailed(method, response.statusText);
        }

        const responseData = await response.json();
        if (responseData.error) {
            return this.#raiser.requestError(method, responseData.error.message);
        }

        return responseData.result;
    }

    #createRequest(
        method: string,
        params: object,
    ): RequestInit {
        return {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: stringify({
                jsonrpc: '2.0',
                id: uuid(),
                method,
                params,
            }),
        };
    }
}