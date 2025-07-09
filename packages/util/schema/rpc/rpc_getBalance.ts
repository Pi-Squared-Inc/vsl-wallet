import { VSLMethod } from "../vsl/schema";
import { RPCAddress, RPCBalance, RPCMethod, RPCUnsigned } from "./schema";

export const GetBalanceSchema = {
    method: RPCMethod.getBalance,
    endpoint: VSLMethod.vsl_getBalance,
    signed: false,
    params: RPCUnsigned({
        address    : RPCAddress
    }),
    transform: (data: any) => ({
        account_id : data.address
    }),
    return: RPCBalance
}