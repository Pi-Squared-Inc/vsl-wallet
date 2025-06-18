import type { RequestArguments } from '@metamask/providers';
import { useMetaMaskContext } from './MetaMaskContext';

export type Request = (params: RequestArguments) => Promise<unknown | null>;

export const useRequest = () => {
  const { provider, setError } = useMetaMaskContext();

  const request: Request = async ({ method, params }) => {
    try {
      const data =
        (await provider?.request({
          method,
          params,
        } as RequestArguments)) ?? null;

      return data;
    } catch (requestError: any) {
      setError(requestError);
      return null;
    }
  };

  return request;
};

export const useRaiseRequest = () => {
  const { provider } = useMetaMaskContext();

  const request: Request = async ({ method, params }) => {
    const data =
      (await provider?.request({
        method,
        params,
      } as RequestArguments)) ?? null;

    return data;
  };

  return request;
};