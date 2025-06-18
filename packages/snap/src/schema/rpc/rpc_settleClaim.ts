import { VSLMethod } from "../vsl/schema";
import { SnapAddressArray, SnapClaim, SnapMethod, SnapSettleClaimHash, SnapSigned } from "./schema";

export const SettleClaimSchema = {
    method: SnapMethod.settleClaim,
    endpoint: VSLMethod.vsl_settleClaim,
    signed: true,
    params: SnapSigned({
        claim     : SnapClaim,
        receivers : SnapAddressArray
    }),
    transform: (data: any) => ({
        claim     : data.claim,
        to        : data.receivers
    }),
    return: SnapSettleClaimHash
}