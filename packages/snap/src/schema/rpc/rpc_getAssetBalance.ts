import { VSLMethod } from "../vsl/schema";
import { SnapAddress, SnapAssetBalance, SnapAssetId, SnapMethod, SnapSigned, SnapUnsigned } from "./schema";

export const GetAssetBalanceSchema = {
    method: SnapMethod.getAssetBalance,
    endpoint: VSLMethod.vsl_getAssetBalance,
    signed: false,
    params: SnapUnsigned({
        address    : SnapAddress,
        assetId    : SnapAssetId,
    }),
    transform: (data: any) => ({
        account_id : data.address,
        asset_id   : data.assetId
    }),
    return: SnapAssetBalance
}