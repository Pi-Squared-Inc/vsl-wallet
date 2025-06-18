import { VSLAddress, VSLBalance, VSLMethod, VSLSettledClaim, VSLUnsigned } from "./schema";

export const GetBalanceSchema = {
    method: VSLMethod.vsl_getAssetById,
    signed: [false],
    params: VSLUnsigned({
        account_id : VSLAddress
    }),
    return: VSLBalance,
} as const;