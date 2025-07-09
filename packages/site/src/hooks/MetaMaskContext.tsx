"use client";
import type { ReactNode } from 'react';
import type { MetaMaskInpageProvider } from '@metamask/providers';
import { createContext, useContext, useEffect, useState } from 'react';
import { defaultSnapOrigin, getSnapsProvider } from '@/utils/metamask';
import type { Snap } from '@metamask/snaps-sdk';
import { KeyringSnapRpcClient } from '@metamask/keyring-snap-client';

type MetaMaskContextType = {
  provider: MetaMaskInpageProvider | null;
  installedSnap: Snap | null;
  setInstalledSnap: (snap: Snap | null) => void;
  reconnecting: boolean;
  setReconnecting: (reconnecting: boolean) => void;
  client: KeyringSnapRpcClient | null;
};

export const MetaMaskContext = createContext<MetaMaskContextType>({
  provider: null,
  installedSnap: null,
  reconnecting: false,
  client: null,
  setReconnecting: () => {},
  setInstalledSnap: () => {},
});

export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<MetaMaskInpageProvider | null>(null);
  const [client, setClient] = useState<KeyringSnapRpcClient | null>(null);
  const [installedSnap, setInstalledSnap] = useState<Snap | null>(null);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    getSnapsProvider().then(setProvider).catch(console.error);
  }, []);

  useEffect(() => {
    setClient(new KeyringSnapRpcClient(defaultSnapOrigin, window.ethereum))
  }, []);

  return (
    <MetaMaskContext.Provider
      value={{
        provider,
        installedSnap, setInstalledSnap,
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
