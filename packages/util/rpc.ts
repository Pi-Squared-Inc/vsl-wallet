import {
    Json,
    JsonRpcParams,
    JsonRpcRequest,
} from '@metamask/utils';
import { RPCMethodEnumSchema } from './schema/rpc/schema';
import { RPCMethodConfig } from './schema/rpc/config';
import { VSLMethodEnumSchema } from './schema/vsl/schema';
import { VSLCaller, VSLKeyring } from './vsl';
import { RPCRaiser } from 'util/error';

export type RPCConfirmor = {
    [key in ]
}


export class RPCCaller {
    #raiser: RPCRaiser;
    #confirmor: any;
    #vslCaller: VSLCaller;

    constructor(raiser: RPCRaiser, confirmor: any, vslCaller: VSLCaller) {
        this.#raiser = raiser;
        this.#confirmor = confirmor;
        this.#vslCaller = vslCaller;
    }

    async call(
        keyring: VSLKeyring,
        request: JsonRpcRequest<JsonRpcParams>
    ): Promise<Json> {
        const parsedResult = RPCMethodEnumSchema.safeParse(request.method);
        if (!parsedResult.success) {
            return this.#raiser.invalidMethod(request.method);
        }

        const method = parsedResult.data;
        const config = RPCMethodConfig[method];

        const parsedEndpoint = VSLMethodEnumSchema.safeParse(config.endpoint);
        if (!parsedEndpoint.success) {
            return this.#raiser.invalidEndpointConfig(config.method, config.endpoint);
        }

        const parsedParams = config.params.safeParse(request.params);
        if (!parsedParams.success) {
            return this.#raiser.invalidParams(config.method, parsedParams.error.issues);
        }

        const parsedData = config.signed
            ? (parsedParams.data as any).data
            : parsedParams.data;

        const data = config.transform?.(parsedData) ?? parsedData;
        await config.confirmation?.(parsedData);

        const result = config.signed
            ? await this.#vslCaller.call(
                config.endpoint,
                data as any,
                keyring,
                (parsedParams.data as any).snapAccountId
            )
            : await this.#vslCaller.call(
                config.endpoint,
                data as any
            );

        const parsedReturn = config.return.safeParse(result);
        if (!parsedReturn.success) {
            this.#raiser.invalidReturn(
                config.method,
                parsedReturn.error.issues
            )
        }

        return parsedReturn.data as any;
    }
}