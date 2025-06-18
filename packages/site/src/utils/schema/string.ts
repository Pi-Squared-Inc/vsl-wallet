import z from "zod/v4"
import { expect } from "./helper"

export const NotAnStringError = (name: string) =>
    expect("string", `${name} is not a string`);
export const NotAnHexStringError = (name: string) =>
    expect("hex string (no prefix)", `${name} is not a hex string`);
export const NotAPrefixedHexStringError = (name: string) =>
    expect("hex string (with prefix)", `${name} is not a prefixed hex string`);
export const HexStringLengthError = (name: string, expectedLength: number) =>
    expect(
        `hex string (no prefix) of length ${expectedLength}`,
        `${name} must be a hex string (no prefix) of length ${expectedLength}`
    );
export const PrefixedHexStringLengthError = (name: string, expectedLength: number) =>
    expect(
        `hex string (with prefix) of length ${expectedLength}`,
        `${name} must be a hex string (with prefix) of length ${expectedLength}`
    );

export const HexString = <T extends number>(bit: T) => {
    return (name: string) => z.string(NotAnStringError(name))
        .regex(/^[0-9A-Fa-f]+$/, NotAnHexStringError(name))
        .length(bit / 4, HexStringLengthError(name, bit / 4))
}

export const PrefixedHexString = <T extends number>(bit: T) => {
    return (name: string) => z.string(NotAnStringError(name))
        .regex(/^0x[0-9A-Fa-f]+$/, NotAPrefixedHexStringError(name))
        .length(bit / 4 + 2, PrefixedHexStringLengthError(name, bit / 4))
}

export const HString = {
    h8: HexString(8),
    h16: HexString(16),
    h32: HexString(32),
    h64: HexString(64),
    h128: HexString(128),
    h256: HexString(256),
    ph8: PrefixedHexString(8),
    ph16: PrefixedHexString(16),
    ph32: PrefixedHexString(32),
    ph64: PrefixedHexString(64),
    ph128: PrefixedHexString(128),
    ph256: PrefixedHexString(256),
}
