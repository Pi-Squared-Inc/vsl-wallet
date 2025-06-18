import { throwAccountNotFound, throwKeyringRequestFailed } from "@/utils/error";
import { useInvokeSnap } from "../useInvokeSnap";
import { useSnapStoreContext } from "../SnapStoreContext";
import { InfoTable } from "@/components/index/InfoTable";
import { CompanionAssetBalance, CompanionAssetName } from "@/utils/schema/schema";
import { updateAccountAction } from "./updateAccount";

export const createAssetAction = {
  name: 'Create Asset',
  inputs: [
    { name: 'Asset Name', type: 'string', schema: CompanionAssetName  },
    { name: 'Asset Supply', type: 'string', schema: CompanionAssetBalance }
  ],
  preparer: (id: string, input: Record<string, any>) => ([
    id,
    input['Asset Name'],
    input['Asset Supply']
  ]),
  useHandler: () => {
    const invokeSnap = useInvokeSnap();
    const { state } = useSnapStoreContext();
    const updateAccounts = updateAccountAction.useHandler();

    return async (id: string, assetName: string, assetSupply: string) => {
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
            data: { address, assetName, assetSupply }
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