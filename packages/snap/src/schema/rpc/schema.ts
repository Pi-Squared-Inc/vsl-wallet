import { z, ZodRawShape } from 'zod/v4';
import { Integer } from '../util/integer';
import { isValidAddress, isValidChecksumAddress } from '@ethereumjs/util';
import { expect } from '../util/helper';
import { HString } from '../util/string';

export const SnapMethodEnumSchema = z.enum([
    'submitClaim',
    'settleClaim',
    'getBalance',
    'transferBalance',
    'getAssetBalance',
    'getAssetBalances',
    'createAsset',
    'transferAsset',
    'getHealth',
]);

export type SnapMethodEnum = z.infer<typeof SnapMethodEnumSchema>;
export const SnapMethod = SnapMethodEnumSchema.enum;

export const SnapAccountId = z
    .uuidv4(expect("UUIDv4", "Account ID must be a valid UUIDv4"))

export const SnapClaim = z
    .string(expect("string", "Claim must be a string"))

export const SnapClaimType = z
    .string(expect("string", "Claim type must be a string"))

export const SnapProof = z
    .string(expect("string", "Proof must be a string"))

export const SnapAddress = z
    .string(expect("string", "Address must be a string"))
    .refine(isValidAddress, expect(
        "Ethereum address",
        "Invalid Ethereum address format"
    ))

export const SnapAddressArray = z
    .array(SnapAddress)
    .min(1, expect(
        "array with length > 1",
        "At least one address is required"
    ))

export const SnapQuorum = Integer
    .u16Casted("Quorum")

export const SnapTimestamp = z.object({
    seconds: Integer.u64Casted("Timestamp seconds"),
    nanos: Integer.u32Casted("Timestamp nanos")
}, expect(
    "Timestamp",
    "Timestamp must be a valid object with seconds and nanos properties"
))

// TODO: Check if this is correct
export const SnapFee = Integer
    .u128PrefixedHexStringCasted("Fee")

export const SnapBalance = Integer
    .u128PrefixedHexStringCasted("Balance")

// TODO: Check if this is correct
export const SnapTransactionHash = z.
    string()

export const SnapSettleClaimHash = z.
    string()

export const SnapAssetBalance = Integer
    .u128PrefixedHexStringCasted("Asset Balance")

export const SnapAssetId = HString
    .h256("Asset ID")

export const SnapAssetBalances = z.
    record(SnapAssetId, SnapAssetBalance)

export const SnapAssetName = z
    .string()

export const SnapOk = z.
    literal('ok')

export const SnapAssetDecimals = Integer.
    u8Casted("Asset Decimal").lte(18n, expect(
        "Asset Decimal",
        "Asset Decimal must be a number between 0 and 18"
    ))

export const SnapSigned = <T extends ZodRawShape>(params: T) => {
    return z.strictObject({
        snapAccountId: SnapAccountId,
        data: z.strictObject(params)
    }, expect(
        "Parameters for Snap Signed Functions",
        "It must be a object with snapAccountId and data properties (see documentation)"
    ));
};

export const SnapUnsigned = <T extends ZodRawShape>(params: T) => {
    return z.strictObject(params, expect(
        "Parameters for Snap Unsigned Functions",
        "It must be a object with the required properties (see documentation)"
    ));
}

export const ActionDeniedError = (action: string) => {
    return `${action} denied by user.`;
}