import { throwAccountNotFound, throwKeyringRequestFailed } from "@/utils/error";
import { useInvokeSnap } from "../useInvokeSnap";
import { State, useSnapStoreContext } from "../SnapStoreContext";
import { InfoRow, InfoTable } from "@/components/index/InfoTable";

export const getAssetBalancesAction = {
  name: 'Get Asset Balances',
  inputs: [],
  preparer: (id: string) => [id],
  useHandler: () => {
    const invokeSnap = useInvokeSnap();
    const { state } = useSnapStoreContext();

    return async (id: string) => {
      const address = state.accounts[id]?.keyringAccount?.address;

      if (address === undefined) {
        throwAccountNotFound(id);
      }

      try {
        return await invokeSnap({
          method: 'getAssetBalances',
          params: { address }
        }) as Record<string, string>;
      } catch (error) {
        return throwKeyringRequestFailed("getAssetBalances", error as Error);
      }
    }
  },
  render: (data: Record<string, string>, state: State) => {
    if (Object.keys(data).length === 0) {
      return <InfoTable info={{
        "No Assets Found": {
          type: 'text',
          data: 'N/A',
          keyType: 'mono'
        }
      }} />;
    }

    const account = state.accounts[state.selectedAccountId!];
    const assets = account?.keyringAccount.options?.assets as Record<string, string> | undefined;

    const info: Record<string, InfoRow> = {};
    const sortedEntries = Object.entries(data).sort(([aId], [bId]) => aId.localeCompare(bId));
    for (const [assetId, balance] of sortedEntries) {
      const name = `${assetId.slice(0, 7)}…${assetId.slice(-5)}`;
      const assetName = assets?.[assetId] ?? '';
      info[name] = {
        type: 'text',
        keyType: 'mono',
        data: `${Number(balance)} ${assetName.toUpperCase()}`,
      }
    }
    return <InfoTable info={info} />
  }
}