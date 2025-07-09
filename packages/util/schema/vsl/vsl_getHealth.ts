import { VSLAddress, VSLBalance, VSLMethod, VSLOk, VSLSettledClaim, VSLUnsigned } from "./schema";

export const GetHealthSchema = {
    method: VSLMethod.vsl_getHealth,
    signed: [false],
    params: VSLUnsigned({}),
    return: VSLOk
} as const;