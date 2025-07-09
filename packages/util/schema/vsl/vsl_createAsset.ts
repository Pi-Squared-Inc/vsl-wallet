import { VSLAddress, VSLAssetBalance, VSLAssetDecimals, VSLAssetId, VSLAssetName, VSLBalance, VSLMethod, VSLNonce, VSLSettledClaim, VSLSigned, VSLUnsigned } from "./schema";

export const CreateAssetSchema = {
    method: VSLMethod.vsl_createAsset,
    signed: [true, "asset_data"],
    params: VSLSigned({
        account_id    : VSLAddress,
        nonce         : VSLNonce,
        ticker_symbol : VSLAssetName,
        decimals      : VSLAssetDecimals,
        total_supply  : VSLAssetBalance,
    }),
    return: VSLAssetId,
} as const;