import { throwAccountNotFound, throwKeyringRequestFailed } from "@/utils/error";
import { useInvokeSnap } from "../useInvokeSnap";
import { useSnapStoreContext } from "../SnapStoreContext";
import { InfoTable } from "@/components/index/InfoTable";
import { CompanionAddress, CompanionBalance } from "@/utils/schema/schema";
import { useSnapReadyGuard } from "../useSnapReadyGuard";

export const transferBalanceAction = {
  name: 'Transfer Balance',
  inputs: [
    { name: 'Receiver Address', type: 'string', schema: CompanionAddress },
    { name: 'Amount', type: 'string', schema: CompanionBalance }
  ],
  preparer: (id: string, inputs: Record<string, any>) => ([
    id,
    inputs['Receiver Address'],
    inputs['Amount']
  ]),
  useHandler: () => {
    const invokeSnap = useInvokeSnap();
    const guard = useSnapReadyGuard();
    const { state } = useSnapStoreContext();

    return async (id: string, receiver: string, amount: string) => {
      guard();

      const address = state.accounts[id]?.keyringAccount?.address;

      if (address === undefined) {
        throwAccountNotFound(id);
      }

      try {
        return await invokeSnap({
          method: 'transferBalance',
          params: {
            snapAccountId: id,
            data: { sender: address, receiver, amount }
          }
        })
      } catch (error) {
        return throwKeyringRequestFailed("transferBalance", error as Error);
      }
    }
  },
  render: (hash: string) => (
    <InfoTable info = {{
      "Transaction Hash": {
        type: "mono",
        data: hash
      },
    }} />
  ),
}