export type ErrorEmitter = ReturnType<typeof expect> | ReturnType<typeof expectSensitive>;
export function expect(expected: string, message: string) {
    return {
        error: (context: any) => {
            return `Expected: ${expected}, Actual: ${context.input}. ${message}`;
        }
    }
}

export function expectSensitive(expected: string, message: string) {
    return {
        error: (context: any) => {
            const maskedActual = context.input.replace(/./g, '*');
            return `Expected: ${expected}, Actual: ${maskedActual}. ${message}`;
        }
    }
}

export const stringLte = (value: bigint) => {
    return (input: string) => {
        const num = BigInt(input);
        return num <= value;
    }
}

