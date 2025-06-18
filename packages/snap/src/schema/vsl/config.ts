import { CreateAssetSchema } from './vsl_createAsset';
import { GetAccountStateSchema } from './vsl_getAccountState';
import { GetAssetBalanceSchema } from './vsl_getAssetBalance';
import { GetAssetBalancesSchema } from './vsl_getAssetBalances';
import { GetBalanceSchema } from './vsl_getBalance';
import { GetHealthSchema } from './vsl_getHealth';
import { GetSettledClaimByIdSchema } from './vsl_getSettledClaimById';
import { ListSettledClaimsForReceiverSchema } from './vsl_listSettledClaimsForReceiver';
import { ListSettledClaimsForSenderSchema } from './vsl_listSettledClaimsForSender';
import { ListSubmittedClaimsForReceiverSchema } from './vsl_listSubmittedClaimsForReceiver';
import { ListSubmittedClaimsForSenderSchema } from './vsl_listSubmittedClaimsForSender';
import { PaySchema } from './vsl_pay';
import { SetAccountStateSchema } from './vsl_setAccountState';
import { SettleClaimSchema } from './vsl_settleClaim';
import { SubmitClaimSchema } from './vsl_submitClaim';
import { TransferAssetSchema } from './vsl_transferAsset';

import z from "zod/v4";
import { VSLMethod, VSLMethodEnum } from "./schema";
import { GetAccountNonceSchema } from './vsl_getAccountNonce';

export type VSLMethodConfigType = {
    [key in VSLMethodEnum]: {
        method: VSLMethodEnum;
        signed: readonly [true, string] | readonly [false];
        params: z.ZodType<any>;
        return: z.ZodType<any>;
    }
}

export const VSLMethodConfig: VSLMethodConfigType = {
    [VSLMethod.vsl_submitClaim]                    : SubmitClaimSchema,
    [VSLMethod.vsl_settleClaim]                    : SettleClaimSchema,
    [VSLMethod.vsl_listSettledClaimsForReceiver]   : ListSettledClaimsForReceiverSchema,
    [VSLMethod.vsl_listSubmittedClaimsForReceiver] : ListSubmittedClaimsForReceiverSchema,
    [VSLMethod.vsl_listSettledClaimsForSender]     : ListSettledClaimsForSenderSchema,
    [VSLMethod.vsl_listSubmittedClaimsForSender]   : ListSubmittedClaimsForSenderSchema,
    [VSLMethod.vsl_getSettledClaimById]            : GetSettledClaimByIdSchema,
    [VSLMethod.vsl_getAccountState]                : GetAccountStateSchema,
    [VSLMethod.vsl_setAccountState]                : SetAccountStateSchema,
    [VSLMethod.vsl_getBalance]                     : GetBalanceSchema,
    [VSLMethod.vsl_pay]                            : PaySchema,
    [VSLMethod.vsl_getAssetBalance]                : GetAssetBalanceSchema,
    [VSLMethod.vsl_getAssetBalances]               : GetAssetBalancesSchema,
    [VSLMethod.vsl_createAsset]                    : CreateAssetSchema,
    [VSLMethod.vsl_transferAsset]                  : TransferAssetSchema,
    [VSLMethod.vsl_getHealth]                      : GetHealthSchema,
    [VSLMethod.vsl_getAccountNonce]                : GetAccountNonceSchema
} as const;
