import { v4 as uuid } from 'uuid';
import { z } from 'zod/v4';
import { stringify, throwError } from './util';
import { signMessage } from './signing';
import { VSLKeyring } from './keyring';
import { VSLMethodEnum } from './schema/vsl/schema';
import { VSLMethodConfig } from './schema/vsl/config';
import { throwVSLInvalidParams, throwVSLInvalidReturn } from './error';

export async function callVSLMethod(
    method     : VSLMethodEnum,
    params     : any,
    keyring   ?: VSLKeyring,
    accountId ?: string,
): Promise<any> {
    const config = VSLMethodConfig[method];

    const result = config.signed[0] === false
        ? await callVSLUnsignedMethod(method, params)
        : await callVSLSignedMethod(
            method, params,
            keyring ?? throwError(`Keyring is required for signed method: ${method}`),
            accountId ?? throwError(`Account ID is required for signed method: ${method}`),
        );

    const parsedResult = config.return.safeParse(result);
    if (!parsedResult.success) {
        throwVSLInvalidReturn(method, parsedResult.error.issues);
    }

    return parsedResult.data;
}

export async function callVSLUnsignedMethod(
    method : VSLMethodEnum,
    params : any,
) {
    const parsedParams = VSLMethodConfig[method].params.safeParse(params);
    if (!parsedParams.success) {
        throwVSLInvalidParams(method, parsedParams.error.issues);
    }

    return await sendRPCRequest(method, parsedParams.data);
}

export async function callVSLSignedMethod<T extends VSLMethodEnum>(
    method    : T,
    params    : z.infer<typeof VSLMethodConfig[T]['params']>,
    keyring   : VSLKeyring,
    accountId : string,
) {
    const wallet = await keyring.getWallet(accountId);
    if (wallet === undefined) {
        throwError(`Wallet not found for account ID: ${accountId}`);
    }

    const wrapper = VSLMethodConfig[method]?.signed[1] as string | undefined;
    if (wrapper === undefined) {
        throwError(`Method ${method} missing wrapper for signed params`);
    }

    const parsedParams = VSLMethodConfig[method].params.safeParse({
        ...params,
        nonce: wallet.nonce,
    })

    if (!parsedParams.success) {
        throwVSLInvalidParams(method, parsedParams.error.issues);
    }

    const signedParams = {
        [wrapper] : signMessage(wallet.privateKey, parsedParams.data),
    }

    const result = await sendRPCRequest(method, signedParams);

    // this should never failed
    keyring.incrementNonce(accountId);

    return result;
}

export async function sendRPCRequest(
    method: VSLMethodEnum,
    params: object,
) {
    const requestBody = createRPCRequest(method, params);

    const response = await fetch(process.env.VSL_ENDPOINT!, requestBody);
    if (!response.ok) {
        throwError(`Failed to send RPC request: ${response.statusText}`);
    }

    const responseData = await response.json();
    if (responseData.error) {
        throwError(`RPC request error: ${responseData.error.message}`);
    }

    const result = responseData.result;
    return result;
}

export function createRPCRequest(method: string, params: object): RequestInit {
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
};
