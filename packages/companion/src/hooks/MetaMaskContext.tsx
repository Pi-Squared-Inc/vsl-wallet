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
  error: Error | null;
  client: KeyringSnapRpcClient | null;
  setInstalledSnap: (snap: Snap | null) => void;
  setError: (error: Error) => void;
};

export const MetaMaskContext = createContext<MetaMaskContextType>({
  provider: null,
  installedSnap: null,
  error: null,
  client: null,
  setInstalledSnap: () => {},
  setError: () => {},
});

export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<MetaMaskInpageProvider | null>(null);
  const [client, setClient] = useState<KeyringSnapRpcClient | null>(null);
  const [installedSnap, setInstalledSnap] = useState<Snap | null>(null);
  const [error, setError] = useState<Error | null>(null);

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
      value={{ provider, error, client, setError, installedSnap, setInstalledSnap }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};

export function useMetaMaskContext() {
  return useContext(MetaMaskContext);
}
