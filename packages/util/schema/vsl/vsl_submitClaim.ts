import { VSLAddress, VSLAddressArray, VSLClaim, VSLClaimType, VSLFee, VSLMethod, VSLNonce, VSLProof, VSLQuorum, VSLSigned, VSLTimestamp, VSLTransactionHash } from "./schema";

export const SubmitClaimSchema = {
    method: VSLMethod.vsl_submitClaim,
    signed: [true, "claim"],
    params: VSLSigned({
        claim      : VSLClaim,
        claim_type : VSLClaimType,
        proof      : VSLProof,
        nonce      : VSLNonce,
        to         : VSLAddressArray,
        quorum     : VSLQuorum,
        from       : VSLAddress,
        expires    : VSLTimestamp,
        fee        : VSLFee,
    }),
    return: VSLTransactionHash,
} as const;