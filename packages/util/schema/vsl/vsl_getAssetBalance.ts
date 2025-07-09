import { VSLAddress, VSLAssetBalance, VSLAssetId, VSLBalance, VSLMethod, VSLSettledClaim, VSLUnsigned } from "./schema";

export const GetAssetBalanceSchema = {
    method: VSLMethod.vsl_getAssetBalance,
    signed: [false],
    params: VSLUnsigned({
        account_id : VSLAddress,
        asset_id   : VSLAssetId,
    }),
    return: VSLAssetBalance,
} as const;