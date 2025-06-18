import { throwAccountNotFound, throwKeyringRequestFailed } from "@/utils/error";
import { useInvokeSnap } from "../useInvokeSnap";
import { useSnapStoreContext } from "../SnapStoreContext";
import { CompanionAddressArray } from "@/utils/schema/schema";
import z from "zod/v4";

export const settleClaimAction = {
  name: 'Settle Claim',
  inputs: [
    { name: 'Claim ID', schema: z.any() },
    { name: 'to address', schema: CompanionAddressArray }
  ],
  useHandler: () => {
    const invokeSnap = useInvokeSnap();
    const { state } = useSnapStoreContext();

    return async (id: string, claim: string, receivers: string) => {
      const address = state.accounts[id]?.keyringAccount?.address;

      if (address === undefined) {
        throwAccountNotFound(id);
      }

      try {
        return await invokeSnap({
          method: 'settleClaim',
          params: {
            snapAccountId: id,
            data: { claim, receivers }
          }
        })
      } catch (error) {
        return throwKeyringRequestFailed("settleClaim", error as Error);
      }
    }
  }
}