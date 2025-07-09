import { type OnKeyringRequestHandler, type OnRpcRequestHandler } from '@metamask/snaps-sdk';

import { handleKeyringRequest } from '@metamask/keyring-snap-sdk';
import { VSLKeyring } from './keyring';
import { getState } from './state';
import { handleRPCRequest } from './rpc';

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  console.log("onRpcRequest", origin, JSON.stringify(request));

  const keyring = await getKeyring();
  const result = await handleRPCRequest(keyring, request);

  console.log("onRpcRequest result", result);

  return result ?? null;
};

// Keyring Instance
let keyringInstance: VSLKeyring;
async function getKeyring(): Promise<VSLKeyring> {
  if (!keyringInstance) {
    const state = await getState();
    if (!keyringInstance) {
      keyringInstance = new VSLKeyring(state);
    }
  }
  return keyringInstance;
}

export const onKeyringRequest: OnKeyringRequestHandler = async ({
  origin,
  request,
}) => {
  console.log("onKeyringRequest", origin, request);

  const keyring = await getKeyring();
  const result = await handleKeyringRequest(keyring, request);

  console.log("onKeyringRequest result", result);

  return result ?? null;
}