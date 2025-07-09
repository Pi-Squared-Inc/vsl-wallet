import { VSLMethod } from "../vsl/schema";
import { RPCMethod, RPCOk, RPCUnsigned } from "./schema";

export const GetHealthSchema = {
    method: RPCMethod.getHealth,
    endpoint: VSLMethod.vsl_getHealth,
    signed: false,
    params: RPCUnsigned({}),
    return: RPCOk
}
