import { VSLMethod } from "../vsl/schema";
import { SnapAddress, SnapAssetBalances, SnapMethod, SnapSigned, SnapUnsigned } from "./schema";

export const GetAssetBalancesSchema = {
    method: SnapMethod.getAssetBalances,
    endpoint: VSLMethod.vsl_getAssetBalances,
    signed: false,
    params: SnapUnsigned({
        address    : SnapAddress,
    }),
    transform: (data: any) => ({
        account_id : data.address
    }),
    return: SnapAssetBalances
}