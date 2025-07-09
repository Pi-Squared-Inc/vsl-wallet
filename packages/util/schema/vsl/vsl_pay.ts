import { VSLAddress, VSLBalance, VSLMethod, VSLNonce, VSLSigned, VSLTransactionHash } from "./schema";

export const PaySchema = {
    method : VSLMethod.vsl_pay,
    signed : [true, "payment"],
    params : VSLSigned({
        from   : VSLAddress,
        to     : VSLAddress,
        amount : VSLBalance,
        nonce  : VSLNonce,
    }),
    return : VSLTransactionHash,
} as const;