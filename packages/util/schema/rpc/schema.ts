import { z, ZodRawShape } from 'zod/v4';
import { Integer } from '../util/integer';
import { isValidAddress, isValidChecksumAddress } from '@ethereumjs/util';
import { expect } from '../util/helper';
import { HString } from '../util/string';

export const RPCMethodEnumSchema = z.enum([
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

export type RPCMethodEnum = z.infer<typeof RPCMethodEnumSchema>;
export const RPCMethod = RPCMethodEnumSchema.enum;

export const RPCAccountId = z
    .uuidv4(expect("UUIDv4", "Account ID must be a valid UUIDv4"))

export const RPCClaim = z
    .string(expect("string", "Claim must be a string"))

export const PRCClaimType = z
    .string(expect("string", "Claim type must be a string"))

export const RPCProof = z
    .string(expect("string", "Proof must be a string"))

export const RPCAddress = z
    .string(expect("string", "Address must be a string"))
    .refine(isValidAddress, expect(
        "Ethereum address",
        "Invalid Ethereum address format"
    ))

export const RPCAddressArray = z
    .array(RPCAddress)
    .min(1, expect(
        "array with length > 1",
        "At least one address is required"
    ))

export const RPCQuorum = Integer
    .u16Casted("Quorum")

export const RPCTimestamp = z.object({
    seconds: Integer.u64Casted("Timestamp seconds"),
    nanos: Integer.u32Casted("Timestamp nanos")
}, expect(
    "Timestamp",
    "Timestamp must be a valid object with seconds and nanos properties"
))

// TODO: Check if this is correct
export const RPCFee = Integer
    .u128PrefixedHexStringCasted("Fee")

export const RPCBalance = Integer
    .u128PrefixedHexStringCasted("Balance")

// TODO: Check if this is correct
export const RPCTransactionHash = z.
    string()

export const RPCSettleClaimHash = z.
    string()

export const RPCAssetBalance = Integer
    .u128PrefixedHexStringCasted("Asset Balance")

export const RPCAssetId = HString
    .h256("Asset ID")

export const RPCAssetBalances = z.
    record(RPCAssetId, RPCAssetBalance)

export const RPCAssetName = z
    .string()

export const RPCOk = z.
    literal('ok')

export const RPCAssetDecimals = Integer.
    u8Casted("Asset Decimal").lte(18n, expect(
        "Asset Decimal",
        "Asset Decimal must be a number between 0 and 18"
    ))

export const RPCSigned = <T extends ZodRawShape>(params: T) => {
    return z.strictObject({
        snapAccountId: RPCAccountId,
        data: z.strictObject(params)
    }, expect(
        "Parameters for Snap Signed Functions",
        "It must be a object with snapAccountId and data properties (see documentation)"
    ));
};

export const RPCUnsigned = <T extends ZodRawShape>(params: T) => {
    return z.strictObject(params, expect(
        "Parameters for Snap Unsigned Functions",
        "It must be a object with the required properties (see documentation)"
    ));
}

export const ActionDeniedError = (action: string) => {
    return `${action} denied by user.`;
}