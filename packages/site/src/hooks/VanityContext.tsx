"use client";
import type { ReactNode } from 'react';
import type { MetaMaskInpageProvider } from '@metamask/providers';
import { createContext, useContext, useEffect, useState } from 'react';
import { defaultSnapOrigin, getSnapsProvider } from '@/utils/metamask';
import type { Snap } from '@metamask/snaps-sdk';
import { KeyringPublicClient, KeyringSnapRpcClient } from '@metamask/keyring-snap-client';
import { VanitySender } from '@/utils/vanity';

type VanityContextType = {
  reconnecting: boolean;
  setReconnecting: (reconnecting: boolean) => void;
  client: KeyringSnapRpcClient | null;
};

export const MetaMaskContext = createContext<VanityContextType>({
  reconnecting: false,
  client: null,
  setReconnecting: () => {},
});

export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<KeyringSnapRpcClient | null>(null);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    setClient(new KeyringPublicClient(VanitySender))
  }, []);

  return (
    <MetaMaskContext.Provider
      value={{
        reconnecting, setReconnecting,
        client
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};

export function useMetaMaskContext() {
  return useContext(MetaMaskContext);
}
