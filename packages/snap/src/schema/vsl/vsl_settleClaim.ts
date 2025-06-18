import { VSLAddressArray, VSLClaim, VSLMethod, VSLNonce, VSLSettleClaimHash, VSLSigned } from "./schema";

export const SettleClaimSchema = {
    method: VSLMethod.vsl_settleClaim,
    signed: [true, "settled_claim"],
    params: VSLSigned({
        claim : VSLClaim,
        nonce : VSLNonce,
        to    : VSLAddressArray,
    }),
    return: VSLSettleClaimHash,
} as const;