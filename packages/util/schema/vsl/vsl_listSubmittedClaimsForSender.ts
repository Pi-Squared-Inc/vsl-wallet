import { VSLAddress, VSLClaimList, VSLMethod, VSLSettleClaimHash, VSLTimestamp, VSLUnsigned } from "./schema";

export const ListSubmittedClaimsForSenderSchema = {
    method: VSLMethod.vsl_listSubmittedClaimsForSender,
    signed: [false],
    params: VSLUnsigned({
        address : VSLAddress,
        since   : VSLTimestamp
    }),
    return: VSLClaimList,
} as const;