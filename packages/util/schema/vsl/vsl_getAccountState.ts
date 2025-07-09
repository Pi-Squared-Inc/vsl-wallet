import { VSLAddress, VSLMethod, VSLStateHash, VSLUnsigned } from "./schema";

export const GetAccountStateSchema = {
    method: VSLMethod.vsl_getAccountState,
    signed: [false],
    params: VSLUnsigned({
        account_id : VSLAddress,
    }),
    return: VSLStateHash,
} as const;