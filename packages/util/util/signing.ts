import {
    ECDSASignature,
    isValidPrivate,
    ecsign,
    hashPersonalMessage,
    bytesToHex,
} from '@ethereumjs/util';
import { encodeMessage } from './encoding';

export type Message =
    | string
    | bigint
    | null
    | Message[]
    | { [key: string]: Message }

export type MessageObject = Record<string, Message>;

export function getSignature(privateKey: string, hash: Uint8Array): ECDSASignature {
    const key = Buffer.from(privateKey, 'hex');
    if (!isValidPrivate(key)) {
        throw new Error('Invalid private key');
    }

    return ecsign(hash, key);
}

type Signed<T> = T & {
    v: number;
    r: string;
    s: string;
    hash: string;
}

export function signMessage(privateKey: string, message: MessageObject): Signed<MessageObject> {
    const encodedMessage = encodeMessage(message);
    const messageHash = hashPersonalMessage(Buffer.from(encodedMessage));
    const { v, r, s } = getSignature(privateKey, messageHash);

    return {
        ...message,
        v: Number(v),
        r: bytesToHex(r),
        s: bytesToHex(s),
        hash: bytesToHex(messageHash),
    } as Signed<MessageObject>;
}