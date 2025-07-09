// export const VSLRaiser = {} as Raiser;
export const VanityKeyringRaiser = {
    duplicateAddress: (address: string) => {
        throw new Error(`Account address already in use: ${address}`);
    },

    accountNotFound(id: string) {
        throw new Error(`Account '${id}' not found`);
    },

    invalidRequestMethod(method: string) {
        throw new Error(`Method '${method}' not supported`);
    },

    invalidPrivateKey() {
        throw new Error('Invalid private key generated');
    }
} as const;
export type VanityKeyringRaiser = typeof VanityKeyringRaiser;
