import { throwAccountNotFound, throwKeyringRequestFailed } from "@/utils/error";
import { useInvokeSnap } from "../useInvokeSnap";
import { useAccountStoreContext } from "../AccountStoreContext";
import { CompanionAddress, CompanionAssetBalance, CompanionAssetId } from "@/utils/schema/schema";
import { InfoTable } from "@/components/index/InfoTable";
import { useSnapReadyGuard } from "../useSnapReadyGuard";

export const transferAssetAction = {
  name: 'Transfer Asset',
  inputs: [
    { name: 'Receiver Address', type: 'string', schema: CompanionAddress },
    { name: 'Asset ID', type: 'string', schema: CompanionAssetId },
    { name: 'Amount', type: 'string', schema: CompanionAssetBalance }
  ],
  preparer: (id: string, inputs: Record<string, any>) => ([
    id,
    inputs['Receiver Address'],
    inputs['Asset ID'],
    inputs['Amount']
  ]),
  useHandler: () => {
    const invokeSnap = useInvokeSnap();
    const { state } = useAccountStoreContext();
    const guard = useSnapReadyGuard();

    return async (id: string, receiver: string, assetId: string, amount: string) => {
      guard();

      const address = state.accounts[id]?.keyringAccount?.address;

      if (address === undefined) {
        throwAccountNotFound(id);
      }

      try {
        return await invokeSnap({
          method: 'transferAsset',
          params: {
            snapAccountId: id,
            data: {
              sender: address,
              receiver,
              assetId,
              amount
            }
          }
        })
      } catch (error) {
        return throwKeyringRequestFailed("transferAsset", error as Error);
      }
    }
  },
  render: (hash: string) => (
    <InfoTable info={{
      "Transaction Hash": {
        type: "mono",
        data: hash
      },
    }} />
  ),
}