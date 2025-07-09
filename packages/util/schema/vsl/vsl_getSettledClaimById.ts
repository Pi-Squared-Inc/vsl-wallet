import { VSLAddress, VSLClaimId, VSLClaimList, VSLMethod, VSLSettleClaimHash, VSLSettledClaim, VSLTimestamp, VSLUnsigned } from "./schema";

export const GetSettledClaimByIdSchema = {
    method: VSLMethod.vsl_getSettledClaimById,
    signed: [false],
    params: VSLUnsigned({
        claim_id: VSLClaimId,
    }),
    return: VSLSettledClaim,
} as const;