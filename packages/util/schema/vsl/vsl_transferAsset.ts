import { VSLAddress, VSLAssetBalance, VSLAssetId, VSLAssetName, VSLBalance, VSLMethod, VSLNonce, VSLSettledClaim, VSLSigned, VSLTransactionHash, VSLUnsigned } from "./schema";

export const TransferAssetSchema = {
    method: VSLMethod.vsl_transferAsset,
    signed: [true, "transfer_asset"],
    params: VSLSigned({
        from     : VSLAddress,
        nonce    : VSLNonce,
        asset_id : VSLAssetId,
        to       : VSLAddress,
        amount   : VSLAssetBalance,
    }),
    return: VSLTransactionHash,
} as const;