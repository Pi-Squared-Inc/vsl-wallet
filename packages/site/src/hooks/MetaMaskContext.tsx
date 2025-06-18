"use client";
import type { ReactNode } from 'react';
import type { MetaMaskInpageProvider } from '@metamask/providers';
import { createContext, useContext, useEffect, useState } from 'react';
import { defaultSnapOrigin, getSnapsProvider } from '@/utils/metamask';
import type { Snap } from '@metamask/snaps-sdk';
import { KeyringSnapRpcClient } from '@metamask/keyring-snap-client';

type MetaMaskContextType = {
  provider: MetaMaskInpageProvider | null;
  error: Error | null;
  setError: (error: Error) => void;
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
  error: null,
  client: null,
  setReconnecting: () => {},
  setInstalledSnap: () => {},
  setError: () => {},
});

export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<MetaMaskInpageProvider | null>(null);
  const [client, setClient] = useState<KeyringSnapRpcClient | null>(null);
  const [installedSnap, setInstalledSnap] = useState<Snap | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    getSnapsProvider().then(setProvider).catch(console.error);
  }, []);

  useEffect(() => {
    setClient(new KeyringSnapRpcClient(defaultSnapOrigin, window.ethereum))
  }, []);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 10000);

      return () => {
        clearTimeout(timeout);
      };
    }

    return undefined;
  }, [error]);

  return (
    <MetaMaskContext.Provider
      value={{
        provider,
        error, setError,
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
