import z from "zod/v4";
import { isValidAddress } from "@ethereumjs/util";
import { expect } from "./helper";
import { Integer } from "./integer";
import { HString } from "./string";


export const CompanionAccountId = z
    .uuidv4(expect("UUIDv4", "Account ID must be a valid UUIDv4"))

export const CompanionClaim = z
    .string(expect("string", "Claim must be a string"))

export const CompanionClaimType = z
    .string(expect("string", "Claim type must be a string"))

export const CompanionProof = z
    .string(expect("string", "Proof must be a string"))

export const CompanionAddress = z
    .string(expect("string", "Address must be a string"))
    .refine(isValidAddress, expect(
        "Ethereum address",
        "Invalid Ethereum address format"
    ))

export const CompanionAddressArray = z.preprocess((data: string) => {
        if (typeof data === "string") {
            return data.split(",").map((item) => item.trim());
        }
        return data;
    }, z.array(CompanionAddress)
    .min(1, expect(
        "array with length > 1",
        "At least one address is required"
    )))


export const CompanionQuorum = Integer
    .u16String("Quorum")

export const CompanionTimestampSeconds = Integer
    .u64String("Timestamp seconds")

export const CompanionTimestampNanos = Integer
    .u32String("Timestamp nanos")

// TODO: Check if this is correct
export const CompanionFee = Integer
    .u128PrefixedHexStringCasted("Fee")

export const CompanionBalance = Integer
    .u128PrefixedHexStringCasted("Balance")

// TODO: Check if this is correct
export const CompanionTransactionHash = z.
    string()

export const CompanionSettleClaimHash = z.
    string()

export const CompanionAssetBalance = Integer
    .u128PrefixedHexStringCasted("Asset Balance")

export const CompanionAssetId = HString
    .h256("Asset ID")

export const CompanionAssetBalances = z.
    record(CompanionAssetId, CompanionAssetBalance)

export const CompanionAssetName = z
    .string()

export const CompanionOk = z.
    literal('ok')
