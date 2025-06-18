import z from 'zod/v4';

import { SnapMethod, SnapMethodEnum } from './schema';
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

export type SnapMethodConfigType = {
    [key in SnapMethodEnum]: {
        method: SnapMethodEnum;
        endpoint: VSLMethodEnum;
        signed: boolean;
        confirmation?: (parsedData: any) => Promise<void>;
        params: z.ZodTypeAny;
        transform?: (data: any) => any;
        return: z.ZodTypeAny;
    }
}

export const SnapMethodConfig: SnapMethodConfigType = {
    [SnapMethod.submitClaim]: SubmitClaimSchema,
    [SnapMethod.settleClaim]: SettleClaimSchema,
    [SnapMethod.getBalance]: GetBalanceSchema,
    [SnapMethod.transferBalance]: TransferBalanceSchema,
    [SnapMethod.getAssetBalance]: GetAssetBalanceSchema,
    [SnapMethod.getAssetBalances]: GetAssetBalancesSchema,
    [SnapMethod.createAsset]: CreateAssetSchema,
    [SnapMethod.transferAsset]: TransferAssetSchema,
    [SnapMethod.getHealth]: GetHealthSchema,
}