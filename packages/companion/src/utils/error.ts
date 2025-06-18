import { z, ZodError } from "zod/v4";

export const throwKeyringNotReady = () => {
    throw new Error('Keyring is not ready');
}

export const throwKeyringRequestFailed = (method: string, error: Error) => {
    if ((error as any)?.data?.issues !== undefined) {
        const prettifiedError = z.prettifyError((error as any).data);
        const formattedError = prettifiedError.split('\n').map(line => `\t\t${line}`).join('\n');

        throw new Error(`Keyring request failed for ${method}: \n \t ${error.message} \n ${formattedError}`);
    }

    throw new Error(`Keyring request failed for ${method}: \n \t ${error.message}`);
}

export const throwAccountNotFound = (id: string) => {
    throw new Error(`Account with id ${id} not found`);
}

export const throwInvalidParameter = (action: string, parameter: string, error: ZodError) => {
    const prettifiedError = z.prettifyError(error);
    const formattedError = prettifiedError.split('\n').map(line => `\t${line}`).join('\n');

    throw new Error(`Invalid parameter for ${action}: ${parameter} \n ${formattedError}`);
}