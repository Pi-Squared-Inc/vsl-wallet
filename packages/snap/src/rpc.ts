import {
    Json,
    JsonRpcParams,
    JsonRpcRequest,
} from '@metamask/utils';
import { stringify, throwError } from './util';
import { callVSLMethod } from './vsl';
import { VSLKeyring } from './keyring';
import { SnapMethodEnum, SnapMethodEnumSchema } from './schema/rpc/schema';
import { VSLMethodEnumSchema } from './schema/vsl/schema';
import { SnapMethodConfig } from './schema/rpc/config';
import { throwSnapInvalidParams, throwMethodNotFound, throwSnapEndpointConfigError } from './error';

const handler = (method: SnapMethodEnum) => {
    return async (
        keyring: VSLKeyring,
        request: JsonRpcRequest<JsonRpcParams>
    ): Promise<Json> => {
        const config = SnapMethodConfig[method]

        const parsedEndpoint = VSLMethodEnumSchema.safeParse(config.endpoint);
        if (!parsedEndpoint.success) {
            return throwSnapEndpointConfigError(config.method, config.endpoint);
        }

        const parsedResult = config.params.safeParse(request.params);
        if (!parsedResult.success) {
            return throwSnapInvalidParams(config.method, parsedResult.error.issues);
        }

        const parsedData = config.signed
            ? (parsedResult.data as any).data
            : parsedResult.data;

        const data = config.transform?.(parsedData) ?? parsedData;
        await config.confirmation?.(parsedData);

        const result = config.signed ?
            await callVSLMethod(
                config.endpoint,
                data as any,
                keyring,
                (parsedResult.data as any).snapAccountId
            ) :
            await callVSLMethod(
                config.endpoint,
                data as any
            );

        const parsedReturn = config.return.safeParse(result);
        if (!parsedReturn.success) {
            throwError(`Invalid return value for method ${config.method}: ${stringify(parsedReturn.error.issues)}`);
        }

        return parsedReturn.data as any;
    }
}

export async function handleRPCRequest(
    keyring: VSLKeyring,
    request: JsonRpcRequest<JsonRpcParams>
): Promise<Json> {
    const parsedResult = SnapMethodEnumSchema.safeParse(request.method);
    if (!parsedResult.success) {
        return throwMethodNotFound(request.method);
    }

    return await handler(parsedResult.data)(keyring, request);
}
