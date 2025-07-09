import { VSLAddress, VSLMethod, VSLSigned, VSLStateHash, VSLUnsigned, VSLVoid } from "./schema";

export const SetAccountStateSchema = {
    method: VSLMethod.vsl_setAccountState,
    signed: [true, "state_data"],
    params: VSLSigned({
        account_id : VSLAddress,
        state_hash : VSLStateHash,
    }),
    return: VSLVoid,
} as const;