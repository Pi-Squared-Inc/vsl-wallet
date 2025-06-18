import { throwAccountNotFound, throwKeyringRequestFailed } from "@/utils/error";
import { useInvokeSnap } from "../useInvokeSnap";
import { useSnapStoreContext } from "../SnapStoreContext";
import { InfoTable } from "@/components/index/InfoTable";
import { CompanionAddressArray, CompanionClaim, CompanionClaimType, CompanionFee, CompanionProof, CompanionQuorum, CompanionTimestampNanos, CompanionTimestampSeconds } from "@/utils/schema/schema";

export const submitClaimAction = {
  name: 'Submit Claim',
  inputs: [
    { name: 'Receiver Addresses', type: 'string', schema: CompanionAddressArray },
    { name: 'Claim', type: 'string', schema: CompanionClaim },
    { name: 'Claim Type', type: 'string', schema: CompanionClaimType },
    { name: 'Proof', type: 'string', schema: CompanionProof },
    { name: 'Quorum', type: 'number', schema: CompanionQuorum },
    { name: 'Expires (seconds)', type: 'number', schema: CompanionTimestampSeconds },
    { name: 'Expires (nanos)', type: 'number', schema: CompanionTimestampNanos },
    { name: 'Fee', type: 'string', schema: CompanionFee }
  ],
  preparer: (id: string, input: Record<string, any>) => ([
    id,
    input['Receiver Addresses'],
    input['Claim'],
    input['Claim Type'],
    input['Proof'],
    input['Quorum'],
    input['Expires (seconds)'],
    input['Expires (nanos)'],
    input['Fee']
  ]),
  useHandler: () => {
    const invokeSnap = useInvokeSnap();
    const { state } = useSnapStoreContext();

    return async (
        id: string, receivers: string[], claim: string, claimType: string,
        proof: string, quorum: string, seconds: number, nanos: number, fee: string
    ) => {
      const address = state.accounts[id]?.keyringAccount?.address;

      if (address === undefined) {
        throwAccountNotFound(id);
      }

      try {
        console.log("Submitting claim with parameters:", {
          method: 'submitClaim',
          params: {
            snapAccountId: id,
            data: {
              sender: address,
              receivers,
              claim,
              claimType,
              proof,
              quorum,
              expires: { seconds, nanos },
              fee
            }
          }
        })
        return await invokeSnap({
          method: 'submitClaim',
          params: {
            snapAccountId: id,
            data: {
              sender: address,
              receivers,
              claim,
              claimType,
              proof,
              quorum,
              expires: { seconds, nanos },
              fee
            }
          }
        })
      } catch (error) {
        return throwKeyringRequestFailed("submitClaim", error as Error);
      }
    }
  },
  render: (result: string) => (
    <InfoTable info={{
      "Transaction Hash": {
        type: "mono",
        data: result,
      }
    }} />
  )
}