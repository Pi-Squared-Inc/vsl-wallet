import { Input } from '@ethereumjs/rlp'
import { throwError } from './util'
import { Message } from './signing'

export function hexToBytes(hex: string): Uint8Array {
  // strip 0x prefix
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex
  if (clean.length % 2 !== 0) {
    throwError(`padded hex string expected, got un-padded hex of length ${clean.length}`)
  }
  const out = new Uint8Array(clean.length / 2)
  for (let i = 0; i < clean.length; i += 2) {
    const byte = parseInt(clean.slice(i, i + 2), 16)
    if (Number.isNaN(byte)) {
      throwError(`hex string expected, got non-hex byte "${clean.slice(i, i + 2)}" at index ${i}`)
    }
    out[i / 2] = byte
  }
  return out
}

export function toBytes(v: Input): Uint8Array {
  if (v instanceof Uint8Array) {
    return v
  }
  if (v == null) {
    return new Uint8Array()
  }
  if (typeof v === 'string') {
    return new TextEncoder().encode(v)
  }
  if (typeof v === 'number' || typeof v === 'bigint') {
    // 0 → empty array
    if (!v) return new Uint8Array()
    // toString(16) + pad to even length
    const hex = v.toString(16)
    const h = hex.padStart(hex.length + (hex.length % 2), '0')
    return hexToBytes(h)
  }
  throwError(`Unsupported type: ${typeof v}`)
}

export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  if (arrays.length === 1) {
    return arrays[0]!;
  }

  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }

  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}

export function encodeLength(len: number, offset: number): Uint8Array {
  if (len < 56) {
    return Uint8Array.of(offset + len)
  }
  const hexLen = len.toString(16)
  const lengthOfLength = hexLen.length / 2
  const prefix = (offset + 55 + lengthOfLength).toString(16).padStart(2, '0')
  // combine prefix-byte + length-bytes
  return hexToBytes(prefix + hexLen.padStart(lengthOfLength * 2, '0'))
}

export function encode(input: Input): Uint8Array {
  // recursive encoding for arrays
  if (Array.isArray(input)) {
    const encoded = input.map(encode)
    let totalLen = 0
    for (const item of encoded) {
      totalLen += item.length
    }
    return concatBytes(encodeLength(totalLen, 0xc0), ...encoded)
  }
  const buf = toBytes(input)
  // single byte < 0x80 encodes as itself
  if (buf.length === 1 && buf[0]! < 0x80) {
    return buf
  }
  // otherwise prefix with string header
  return concatBytes(encodeLength(buf.length, 0x80), buf)
}

export function messageToInput(message: Message): Input {
  if (Array.isArray(message)) {
    return message.map(messageToInput)
  }
  if (typeof message === 'object' && message !== null) {
    return Object.values(message).map(messageToInput)
  }
  return message
}

export function encodeMessage(message: Message): Uint8Array {
    return encode(messageToInput(message));
}