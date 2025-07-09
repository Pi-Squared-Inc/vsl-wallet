import { VSLCaller, VSLRaiser } from "vsl-snap-util";
import { VanityKeyring } from "./keyring";
import { VanityKeyringRaiser } from "./error";
import { type OnKeyringRequestHandler, type OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { handleKeyringRequest } from '@metamask/keyring-snap-sdk';

const keyringInstance = new VanityKeyring(
    {
        wallets: {},
        pendingRequests: {},
        useSyncApprovals: false,
    },
    VanityKeyringRaiser,
    new VSLCaller(VSLRaiser)
);

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  const result = await handleRPCRequest(keyringInstance, request);
  return result ?? null;
};

export const onKeyringRequest: OnKeyringRequestHandler = async ({
  origin,
  request,
}) => {
  const result = await handleKeyringRequest(keyringInstance, request);
  return result ?? null;
}