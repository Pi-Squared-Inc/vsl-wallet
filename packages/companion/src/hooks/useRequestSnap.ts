import { useMetaMaskContext } from './MetaMaskContext';
import { useRequest } from './useRequest';
import { defaultSnapOrigin } from '@/utils/metamask';
import type { Snap } from '@metamask/snaps-sdk';

/**
 * Utility hook to wrap the `wallet_requestSnaps` method.
 *
 * @param snapId - The requested Snap ID. Defaults to the snap ID specified in the
 * config.
 * @param version - The requested version.
 * @returns The `wallet_requestSnaps` wrapper.
 */
export const useRequestSnap = (
  snapId = defaultSnapOrigin,
  version?: string,
) => {
  const request = useRequest();
  const { setInstalledSnap, setReconnecting } = useMetaMaskContext();

  const requestSnap = async () => {
    setReconnecting(true);
    const snaps = (await request({
      method: 'wallet_requestSnaps',
      params: {
        [snapId]: version ? { version } : {},
      },
    })) as Record<string, Snap>;

    // Updates the `installedSnap` context variable since we just installed the Snap.
    setInstalledSnap(snaps?.[snapId] ?? null);
    setReconnecting(false);
  };

  return requestSnap;
};
