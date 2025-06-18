import { VSLAddress, VSLClaimList, VSLMethod, VSLSettleClaimHash, VSLTimestamp, VSLUnsigned } from "./schema";

export const ListSettledClaimsForSenderSchema = {
    method: VSLMethod.vsl_listSettledClaimsForSender,
    signed: [false],
    params: VSLUnsigned({
        address : VSLAddress,
        since   : VSLTimestamp
    }),
    return: VSLClaimList,
} as const;