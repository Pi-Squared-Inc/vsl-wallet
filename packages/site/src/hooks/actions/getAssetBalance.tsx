import { throwAccountNotFound, throwKeyringRequestFailed } from "@/utils/error";
import { useInvokeSnap } from "../useInvokeSnap";
import { useSnapStoreContext } from "../SnapStoreContext";
import { CompanionAssetId } from "@/utils/schema/schema";
import { InfoTable } from "@/components/index/InfoTable";
import { useSnapReadyGuard } from "../useSnapReadyGuard";

export const getAssetBalanceAction = {
  name: 'Get Asset Balance',
  inputs: [
    { name: 'Asset ID', type: 'string', schema: CompanionAssetId }
  ],
  preparer: (id: string, input: Record<string, any>) => ([
    id,
    input['Asset ID']
  ]),
  useHandler: () => {
    const invokeSnap = useInvokeSnap();
    const { state } = useSnapStoreContext();
    const guard = useSnapReadyGuard();

    return async (id: string, assetId: string) => {
      guard();
      const address = state.accounts[id]?.keyringAccount?.address;

      if (address === undefined) {
        throwAccountNotFound(id);
      }

      try {
        return await invokeSnap({
          method: 'getAssetBalance',
          params: { address, assetId }
        })
      } catch (error) {
        return throwKeyringRequestFailed("getAssetBalance", error as Error);
      }
    }
  },
  render: (balance: any) => (
    <InfoTable info={{
      "Asset Balance": {
        type: "text",
        data: String(Number(balance)),
      }
    }} />
  )
}