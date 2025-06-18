"use client";
import { useEffect, useState } from 'react';
import { useMetaMaskContext } from './MetaMaskContext';
import { useRequest } from './useRequest';
import { defaultSnapOrigin } from '@/utils/metamask';
import type { GetSnapsResponse } from '@/utils/metamask';

export const useMetaMask = () => {
  const { provider, setInstalledSnap, installedSnap } = useMetaMaskContext();
  const request = useRequest();

  const [isFlask, setIsFlask] = useState(false);

  const snapsDetected = provider !== null;

  const detectFlask = async () => {
    const clientVersion = await request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    setIsFlask(isFlaskDetected);
  };

  const getSnap = async () => {
    const snaps = (await request({
      method: 'wallet_getSnaps',
    })) as GetSnapsResponse;

    setInstalledSnap(snaps[defaultSnapOrigin] ?? null);
  };

  useEffect(() => {
    const detect = async () => {
      if (provider) {
        await detectFlask();
        await getSnap();
      }
    };

    detect().catch(console.error);
  // no need to also include detectFlask and getSnap in the dependency array
  // as when the provider changes, they will also be evaluated again.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  return { isFlask, snapsDetected, installedSnap, getSnap };
};
