import { VSLMethod } from "../vsl/schema";
import { SnapMethod, SnapOk, SnapUnsigned } from "./schema";

export const GetHealthSchema = {
    method: SnapMethod.getHealth,
    endpoint: VSLMethod.vsl_getHealth,
    signed: false,
    params: SnapUnsigned({}),
    return: SnapOk
}
