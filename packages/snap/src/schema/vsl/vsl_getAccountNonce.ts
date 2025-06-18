import { VSLAddress, VSLMethod, VSLNonce, VSLUnsigned } from "./schema";

export const GetAccountNonceSchema = {
    method: VSLMethod.vsl_getAccountNonce,
    signed: [false],
    params: VSLUnsigned({
        account_id : VSLAddress,
    }),
    return: VSLNonce,
} as const;