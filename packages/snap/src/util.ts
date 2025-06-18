import type { Wallet } from './keyring';

export function isUniqueAddress(address: string, wallets: Wallet[]): boolean {
    return !wallets.find((wallet) => wallet.account.address === address);
}

export function throwError(...errors: any): never {
    throw new Error(errors);
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

export async function runAsyncSensitive<T>(
    callback: () => Promise<T>,
    message = 'An unexpected error occurred',
): Promise<T> {
    try {
        return await callback();
    } catch (err) {
        console.warn('Here we get an error');
        // TODO!: change this to message at production
        throw new Error((err as Error).message);
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


