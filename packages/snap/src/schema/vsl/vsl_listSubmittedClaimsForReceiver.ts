import { VSLAddress, VSLClaimList, VSLMethod, VSLSettleClaimHash, VSLTimestamp, VSLUnsigned } from "./schema";

export const ListSubmittedClaimsForReceiverSchema = {
    method: VSLMethod.vsl_listSubmittedClaimsForReceiver,
    signed: [false],
    params: VSLUnsigned({
        address : VSLAddress,
        since   : VSLTimestamp
    }),
    return: VSLClaimList,
} as const;