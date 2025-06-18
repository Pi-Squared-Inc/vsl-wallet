import { z } from 'zod/v4';
import { expect } from './helper';
import { NotAnHexStringError, NotAnStringError, NotAPrefixedHexStringError } from "./string";

export const UnsignedNegativeError = (name: string, bit: number) =>
    expect("non-negative bigint", `${name} must be non-negative`);

export const UnsignedOutOfRangeError = (name: string, bit: number) =>
    expect(`2^${bit} bigint`, `${name} must be less than 2^${bit}`);

export const NotAnUnsignedError = (name: string) =>
    expect("bigint", `${name} is not an unsigned`);

export const NotAnEncodedUnsignedError = (name: string) =>
    expect("bigint", `${name} cannot be casted into unsigned integer`);

export const Unsigned = <T extends number>(bit: T) => {
    return (name: string) => z.bigint(NotAnUnsignedError(`${name} (bigint)`))
        .gte(0n, UnsignedNegativeError(`${name} (bigint)`, bit))
        .lt(2n ** BigInt(bit), UnsignedOutOfRangeError(`${name} (bigint)`, bit));
};

export const UnsignedCasted = <T extends number>(bit: T) => {
    return (name: string) => z.coerce.bigint(NotAnEncodedUnsignedError(name))
        .gte(0n, UnsignedNegativeError(`${name} (casted bigint)`, bit))
        .lt(2n ** BigInt(bit), UnsignedOutOfRangeError(`${name} (casted bigint)`, bit));
}

export const UnsignedCastedGeneric = <T extends number>(bit: T) => {
    return (name: string) => z.coerce.bigint(NotAnEncodedUnsignedError(name))
        .gte(0n, UnsignedNegativeError(name, bit))
        .lt(2n ** BigInt(bit), UnsignedOutOfRangeError(name, bit))
}

export const UnsignedString = <T extends number>(bit: T) => {
    return (name: string) => z.string(NotAnStringError(name))
        .check((context) => {
            const Unsigned = UnsignedCastedGeneric(bit)(`${name} (string encoded bigint)`);
            const result = Unsigned.safeParse(context.value);
            if (!result.success) {
                context.issues = result.error.issues;
            }
        })
}

export const UnsignedStringCasted = <T extends number>(bit: T) => {
    return (name: string) => z.preprocess((value) => {
        if (typeof value === 'number') {
            return value.toString();
        }
        if (typeof value === 'bigint') {
            return value.toString();
        }
        return value;
    }, UnsignedString(bit)(name))
}


export const UnsignedPrefixedHexString = <T extends number>(bit: T) => {
    return (name: string) => z.string(NotAnStringError(name))
        .regex(/^0x[0-9A-Fa-f]+$/, NotAPrefixedHexStringError(name))
        .check((context) => {
            const Unsigned = UnsignedCastedGeneric(bit)(`${name} (hex string encoded bigint)`);
            const result = Unsigned.safeParse(context.value);
            if (!result.success) {
                context.issues = result.error.issues;
            }
        })
}

export const UnsignedPrefixHexStringCasted = <T extends number>(bit: T) => {
    return (name: string) => z.preprocess((value) => {
        if (typeof value === 'number') {
            return `0x${value.toString(16)}`;
        }
        if (typeof value === 'string' && !value.startsWith('0x')) {
            try {
                value = BigInt(value).toString(16);
                return `0x${value}`;
            } catch (_) {
                return value;
            }
        }
        return value;
    }, UnsignedPrefixedHexString(bit)(name))
}

export const Integer = {
    u8: Unsigned(8),
    u16: Unsigned(16),
    u32: Unsigned(32),
    u64: Unsigned(64),
    u128: Unsigned(128),
    u256: Unsigned(256),
    u8Casted: UnsignedCasted(8),
    u16Casted: UnsignedCasted(16),
    u32Casted: UnsignedCasted(32),
    u64Casted: UnsignedCasted(64),
    u128Casted: UnsignedCasted(128),
    u256Casted: UnsignedCasted(256),
    u8String: UnsignedString(8),
    u16String: UnsignedString(16),
    u32String: UnsignedString(32),
    u64String: UnsignedString(64),
    u128String: UnsignedString(128),
    u256String: UnsignedString(256),
    u8StringCasted: UnsignedStringCasted(8),
    u16StringCasted: UnsignedStringCasted(16),
    u32StringCasted: UnsignedStringCasted(32),
    u64StringCasted: UnsignedStringCasted(64),
    u128StringCasted: UnsignedStringCasted(128),
    u256StringCasted: UnsignedStringCasted(256),
    u8PrefixedHexString: UnsignedPrefixedHexString(8),
    u16PrefixedHexString: UnsignedPrefixedHexString(16),
    u32PrefixedHexString: UnsignedPrefixedHexString(32),
    u64PrefixedHexString: UnsignedPrefixedHexString(64),
    u128PrefixedHexString: UnsignedPrefixedHexString(128),
    u256PrefixedHexString: UnsignedPrefixedHexString(256),
    u8PrefixedHexStringCasted: UnsignedPrefixHexStringCasted(8),
    u16PrefixedHexStringCasted: UnsignedPrefixHexStringCasted(16),
    u32PrefixedHexStringCasted: UnsignedPrefixHexStringCasted(32),
    u64PrefixedHexStringCasted: UnsignedPrefixHexStringCasted(64),
    u128PrefixedHexStringCasted: UnsignedPrefixHexStringCasted(128),
    u256PrefixedHexStringCasted: UnsignedPrefixHexStringCasted(256),
}