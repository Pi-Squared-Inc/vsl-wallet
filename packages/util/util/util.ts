import {
    KeyringAccount
} from '@metamask/keyring-api';

type Wallet = {
    account: KeyringAccount;
    [key: string]: any;
}

export function throwError(...errors: any): never {
    throw new Error(errors);
}

export function isUniqueAddress<T extends Wallet>(address: string, wallets: T[]): boolean {
    return !wallets.find((wallet) => wallet.account.address === address);
}

export function runSensitive<Type>(
    callback: () => Type,
    message = 'An unexpected error occurred',
): Type {
    try {
        return callback();
    } catch (error) {
        throw new Error(message);
    }
}

// correctly stringify bigints directly to JSON
export function stringify(value: any): string {
    if (value === null) return 'null';
    switch (typeof value) {
        case 'bigint':
            return value.toString();
        case 'number':
            return isFinite(value) ? String(value) : 'null';
        case 'boolean':
            return value ? 'true' : 'false';
        case 'string':
            return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
        const items = value.map((v) => stringify(v)).join(',');
        return `[${items}]`;
    }

    // objects
    if (typeof value === 'object') {
        const entries = Object.entries(value as Record<string, unknown>)
            .filter(([, v]) => v !== undefined && typeof v !== 'function')
            .map(([k, v]) => `${JSON.stringify(k)}:${stringify(v)}`);
        return `{${entries.join(',')}}`;
    }

    // everything else (undefined, functions, symbols)
    return 'null';
}