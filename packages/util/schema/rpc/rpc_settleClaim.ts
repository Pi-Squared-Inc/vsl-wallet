import { VSLMethod } from "../vsl/schema";
import { RPCAddressArray, RPCClaim, RPCMethod, RPCSettleClaimHash, RPCSigned } from "./schema";

export const SettleClaimSchema = {
    method: RPCMethod.settleClaim,
    endpoint: VSLMethod.vsl_settleClaim,
    signed: true,
    params: RPCSigned({
        claim     : RPCClaim,
        receivers : RPCAddressArray
    }),
    transform: (data: any) => ({
        claim     : data.claim,
        to        : data.receivers
    }),
    return: RPCSettleClaimHash
}