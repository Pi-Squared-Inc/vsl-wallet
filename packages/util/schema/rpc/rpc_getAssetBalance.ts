import { VSLMethod } from "../vsl/schema";
import { RPCAddress, RPCAssetBalance, RPCAssetId, RPCMethod, RPCSigned, RPCUnsigned } from "./schema";

export const GetAssetBalanceSchema = {
    method: RPCMethod.getAssetBalance,
    endpoint: VSLMethod.vsl_getAssetBalance,
    signed: false,
    params: RPCUnsigned({
        address    : RPCAddress,
        assetId    : RPCAssetId,
    }),
    transform: (data: any) => ({
        account_id : data.address,
        asset_id   : data.assetId
    }),
    return: RPCAssetBalance
}