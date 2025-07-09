import { VSLAddress, VSLClaimList, VSLMethod, VSLSettleClaimHash, VSLTimestamp, VSLUnsigned } from "./schema";

export const ListSettledClaimsForReceiverSchema = {
    method: VSLMethod.vsl_listSettledClaimsForReceiver,
    signed: [false],
    params: VSLUnsigned({
        address : VSLAddress.nullable(),
        since   : VSLTimestamp
    }),
    return: VSLClaimList,
} as const;