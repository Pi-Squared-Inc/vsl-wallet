import z from 'zod/v4';

import { RPCMethod, RPCMethodEnum } from './schema';
import { VSLMethodEnum } from '../vsl/schema';

import { SubmitClaimSchema } from './rpc_submitClaim';
import { SettleClaimSchema } from './rpc_settleClaim';
import { GetBalanceSchema } from './rpc_getBalance';
import { TransferBalanceSchema } from './rpc_transferBalance';
import { GetAssetBalanceSchema } from './rpc_getAssetBalance';
import { GetAssetBalancesSchema } from './rpc_getAssetBalances';
import { CreateAssetSchema } from './rpc_createAsset';
import { TransferAssetSchema } from './rpc_transferAsset';
import { GetHealthSchema } from './rpc_getHealth';

export type RPCMethodConfigType = {
    [key in RPCMethodEnum]: {
        method: RPCMethodEnum;
        endpoint: VSLMethodEnum;
        signed: boolean;
        confirmation?: (parsedData: any) => Promise<void>;
        params: z.ZodTypeAny;
        transform?: (data: any) => any;
        return: z.ZodTypeAny;
    }
}

export const RPCMethodConfig: RPCMethodConfigType = {
    [RPCMethod.submitClaim]: SubmitClaimSchema,
    [RPCMethod.settleClaim]: SettleClaimSchema,
    [RPCMethod.getBalance]: GetBalanceSchema,
    [RPCMethod.transferBalance]: TransferBalanceSchema,
    [RPCMethod.getAssetBalance]: GetAssetBalanceSchema,
    [RPCMethod.getAssetBalances]: GetAssetBalancesSchema,
    [RPCMethod.createAsset]: CreateAssetSchema,
    [RPCMethod.transferAsset]: TransferAssetSchema,
    [RPCMethod.getHealth]: GetHealthSchema,
}