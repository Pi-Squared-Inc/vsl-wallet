import { Json, SnapError } from "@metamask/snaps-sdk"
import { $ZodIssue } from "zod/v4/core"

export const throwMethodNotFound = (method: string): never => {
    throw new SnapError({
        code: -32601,
        message: `Invalid Snap RPC Method: ${method}`,
        data: {
            cause: `Invalid Snap RPC Method: ${method}`,
            method,
        },
    })
}

export const throwSnapInvalidParams = (method: string, issues: $ZodIssue[]) => {
    throw new SnapError({
        code: -32602,
        message: `Invalid parameters for Snap method ${method}`,
        data: {
            cause: `Invalid parameters for Snap method ${method}`,
            method,
            issues: issues as any,
        },
    })
}

export const throwVSLInvalidParams = (endpoint: string, issues: $ZodIssue[]) => {
    throw new SnapError({
        code: -32603,
        message: `Invalid parameters for VSL endpoint ${endpoint}`,
        data: {
            cause: `Snap endpoint configuration error for endpoint: ${endpoint}`,
            endpoint,
            issues: issues as any,
        },
    })
}

export const throwVSLInvalidReturn = (endpoint: string, issues: $ZodIssue[]) => {
    throw new SnapError({
        code: -32603,
        message: `Invalid return value for VSL endpoint ${endpoint}`,
        data: {
            cause: `Invalid return value for VSL endpoint ${endpoint}`,
            endpoint,
            issues: issues as any,
        },
    })
}

export const throwSnapEndpointConfigError = (method: string, endpoint: string): never => {
    throw new SnapError({
        code: -32603,
        message: `Snap endpoint configuration error for method: ${method}`,
        data: {
            cause: `Endpoint ${endpoint} is not a valid VSL method`,
            method,
            endpoint,
        }
    })
}
