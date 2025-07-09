import { VSLMethod } from "../vsl/schema";
import { RPCAddress, RPCAssetBalances, RPCMethod, RPCSigned, RPCUnsigned } from "./schema";

export const GetAssetBalancesSchema = {
    method: RPCMethod.getAssetBalances,
    endpoint: VSLMethod.vsl_getAssetBalances,
    signed: false,
    params: RPCUnsigned({
        address    : RPCAddress,
    }),
    transform: (data: any) => ({
        account_id : data.address
    }),
    return: RPCAssetBalances
}