import { z } from 'zod/v4';
import { stringify } from './util';

export const VSLRaiser = {
    invalidReturn: (method: string, issues: z.core.$ZodIssue[]) => {
        throw new Error(`Invalid return for method '${method}': ${issues.map(issue => issue.message).join(', ')}`);
    },
    invalidParams: (method: string, issues: z.core.$ZodIssue[]) => {
        throw new Error(`Invalid params for method '${method}': ${issues.map(issue => issue.message).join(', ')}`);
    },
    requestFailed: (method: string, message: string) => {
        throw new Error(`Request failed for method '${method}': ${message}`);
    },
    requestError: (method: string, message: string) => {
        throw new Error(`Request error for method '${method}': ${message}`);
    },
    missingKeyring: (method: string) => {
        throw new Error(`Keyring is required for signed method: ${method}`);
    },
    missingAccountId: (method: string) => {
        throw new Error(`Account ID is required for signed method: ${method}`);
    },
    missingWrapperName: (method: string) => {
        throw new Error(`Method '${method}' missing wrapper for signed params`);
    },
} as const;
export type VSLRaiser = typeof VSLRaiser;

export const RPCRaiser = {
    invalidMethod: (method: string) => {
        throw new Error(`Invalid method: ${method}`);
    },
    invalidEndpointConfig: (method: string, endpoint: string) => {
        throw new Error(`Invalid endpoint config for method '${method}': ${endpoint}`);
    },
    invalidParams: (method: string, issues: z.core.$ZodIssue[]) => {
        throw new Error(`Invalid params for method '${method}': ${stringify(issues)}`);
    },
    invalidReturn: (method: string, issues: z.core.$ZodIssue[]) => {
        throw new Error(`Invalid return for method '${method}': ${stringify(issues)}`);
    },
}
export type RPCRaiser = typeof RPCRaiser;