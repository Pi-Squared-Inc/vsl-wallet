import { VSLMethod } from "../vsl/schema";
import { SnapAddress, SnapBalance, SnapMethod, SnapUnsigned } from "./schema";

export const GetBalanceSchema = {
    method: SnapMethod.getBalance,
    endpoint: VSLMethod.vsl_getBalance,
    signed: false,
    params: SnapUnsigned({
        address    : SnapAddress
    }),
    transform: (data: any) => ({
        account_id : data.address
    }),
    return: SnapBalance
}