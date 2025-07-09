import { throwAccountNotFound, throwKeyringRequestFailed } from "@/utils/error";
import { useInvokeSnap } from "../useInvokeSnap";
import { useAccountStoreContext } from "../AccountStoreContext";
import { InfoTable } from "@/components/index/InfoTable";
import { CompanionAssetBalance, CompanionAssetDecimals, CompanionAssetName } from "@/utils/schema/schema";
import { updateAccountAction } from "./updateAccount";
import { useSnapReadyGuard } from "../useSnapReadyGuard";

export const createAssetAction = {
  name: 'Create Asset',
  inputs: [
    { name: 'Asset Name', type: 'string', schema: CompanionAssetName  },
    { name: 'Asset Supply', type: 'string', schema: CompanionAssetBalance },
    { name: 'Asset Decimals', type: 'string', schema: CompanionAssetDecimals }
  ],
  preparer: (id: string, input: Record<string, any>) => ([
    id,
    input['Asset Name'],
    input['Asset Supply'],
    input['Asset Decimals']
  ]),
  useHandler: () => {
    const invokeSnap = useInvokeSnap();
    const { state } = useAccountStoreContext();
    const updateAccounts = updateAccountAction.useHandler();
    const guard = useSnapReadyGuard();

    return async (id: string, assetName: string, assetSupply: string, assetDecimals: string) => {
      guard();
      const account = state.accounts[id];
      if (account === undefined) {
        throwAccountNotFound(id);
      }

      const address = account.keyringAccount.address;

      let assetHash;
      try {
        assetHash = await invokeSnap({
          method: 'createAsset',
          params: {
            snapAccountId: id,
            data: { address, assetName, assetSupply, assetDecimals }
          }
        }) as string;
      } catch (error) {
        return throwKeyringRequestFailed("createAsset", error as Error);
      }

      const options = account.keyringAccount.options;
      const assets = options.assets as Record<string, string> ?? {};
      assets[assetHash] = assetName

      await updateAccounts(id, {
        ...options,
        assets
      })
    }
  },
  render: (hash: any) => (
    <InfoTable info={{
      "Asset ID": {
        type: "mono",
        data: hash
      }
    }} />
  ),
}