import { VSLAddress, VSLAssetBalances, VSLAssetId, VSLBalance, VSLMethod, VSLSettledClaim, VSLUnsigned } from "./schema";

export const GetAssetBalancesSchema = {
    method: VSLMethod.vsl_getAssetBalances,
    signed: [false],
    params: VSLUnsigned({
        account_id : VSLAddress,
    }),
    return: VSLAssetBalances,
} as const;