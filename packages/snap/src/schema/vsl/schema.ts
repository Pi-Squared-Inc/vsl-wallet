import { z, ZodRawShape } from 'zod/v4';
import { isValidAddress, isValidChecksumAddress } from '@ethereumjs/util';

import { ErrorEmitter, expect } from '../util/helper';
import { Integer } from '../util/integer';
import { HString } from '../util/string';

export const VSLMethodEnumSchema = z.enum([
    // Claims
    'vsl_submitClaim',
    'vsl_settleClaim',

    // Show claims
    'vsl_listSettledClaimsForReceiver',
    'vsl_listSubmittedClaimsForReceiver',
    'vsl_listSettledClaimsForSender',
    'vsl_listSubmittedClaimsForSender',
    'vsl_getSettledClaimById',

    // Accounts
    'vsl_getAccountState',
    'vsl_setAccountState',

    // Balances
    'vsl_getBalance',
    'vsl_pay',

    // Assets
    'vsl_getAssetBalance',
    'vsl_getAssetBalances',
    'vsl_createAsset',
    'vsl_transferAsset',

    // Misc
    'vsl_getHealth',
    'vsl_getAccountNonce'
]);

export type VSLMethodEnum = z.infer<typeof VSLMethodEnumSchema>;
export const VSLMethod = VSLMethodEnumSchema.enum;

export const VSLAccountId = z
    .uuidv4(expect("UUIDv4", "Account ID must be a valid UUIDv4"))

export const VSLClaim = z
    .string(expect("string", "Claim must be a string"))

export const VSLClaimType = z
    .string(expect("string", "Claim type must be a string"))

export const VSLProof = z
    .string(expect("string", "Proof must be a string"))

export const VSLAddress = z
    .string(expect("string", "Address must be a string"))
    .refine(isValidAddress, expect(
        "Ethereum address",
        "Invalid Ethereum address format"
    ))

export const VSLAddressArray = z
    .array(VSLAddress)
    .min(1, expect(
        "array with length > 1",
        "At least one address is required"
    ))

export const VSLQuorum = Integer
    .u16Casted("Quorum")

export const VSLTimestamp = z.object({
    seconds: Integer.u64("Timestamp seconds"),
    nanos: Integer.u32("Timestamp nanos")
}, expect(
    "Timestamp",
    "Timestamp must be a valid object with seconds and nanos properties"
))

export const VSLNonce = Integer
    .u64StringCasted("Nonce")

// TODO: Check if this is correct
export const VSLFee = Integer
    .u128PrefixedHexString("Fee")

export const VSLBalance = Integer
    .u128PrefixedHexString("Balance")

// TODO: Check if this is correct
export const VSLTransactionHash = z.
    string()

export const VSLSettleClaimHash = z.
    string()

export const VSLAssetBalance = Integer.
    u128PrefixedHexString("Asset Balance")

export const VSLAssetId = HString.
    h256("Asset ID")

export const VSLAssetBalances = z.
    record(VSLAssetId, VSLAssetBalance)

export const VSLAssetName = z
    .string()

export const VSLAsset = z.any()
export const VSLStateHash = z.any()
export const VSLVoid = z.void()

export const VSLClaimId = z.any()
export const VSLClaimList = z.any()
export const VSLSettledClaim = z.any()

export const VSLOk = z.
    literal('ok')

export const OrderedCasted = <T extends ZodRawShape>(object: T, message: ErrorEmitter) => {
    const schemaKeys = Object.keys(object);
    return z.strictObject(object, message).transform(
        data => Object.fromEntries(
            schemaKeys.map(key => [key, (data as T)[key]])
        ) as T
    );
};

export const VSLSigned = <T extends ZodRawShape>(params: T) => {
    return OrderedCasted(
        params, expect(
            "Parameters for VSL Signed Functions",
            "It must be an ordered object (see documentation) with required properties"
        )
    )
};

export const VSLUnsigned = <T extends ZodRawShape>(params: T) => {
    return z.object(
        params, expect(
            "Parameters for VSL Unsigned Functions",
            "It must have required properties (see documentation)"
        )
    )
}

