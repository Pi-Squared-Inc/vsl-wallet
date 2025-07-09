import z from "zod/v4";
import { throwAccountNotFound, throwKeyringRequestFailed } from "@/utils/error";
import { useAccountStoreContext } from "../AccountStoreContext";
import { useSnapReadyGuard } from "../useSnapReadyGuard";
import { InfoTable } from "@/components/index/InfoTable";

export const personalSignAction = {
  name: 'Personal Sign',
  inputs: [
    { name: "Message", type: 'string', schema: z.string().min(1, "Message is required") },
  ],
  preparer: (id: string, input: Record<string, any>) => [id, input["Message"]],
  useHandler: () => {
    const { state } = useAccountStoreContext();
    const guard = useSnapReadyGuard();

    return async (id: string, message: string) => {
        guard();

        let address = state.accounts[id]?.keyringAccount?.address;
        if (!address) {
            throwAccountNotFound(id);
        }

        address = address.toLowerCase();

        let connectedAccounts: string[];
        try {
            connectedAccounts = await ethereum.request({
                method: 'eth_requestAccounts',
                params: []
            }) as string[];
        } catch (error) {
            return throwKeyringRequestFailed("personalSignAction", error as Error);
        }

        if (!connectedAccounts.includes(address)) {
            if (connectedAccounts.length !== 0) {
                try {
                    await ethereum.request({
                        method: 'wallet_revokePermissions',
                        params: [{
                            eth_accounts: {}
                        }]
                    })
                } catch (error) {
                    return throwKeyringRequestFailed("personalSignAction", error as Error);
                }
            }

            try {
                connectedAccounts = await ethereum.request({
                    method: 'eth_requestAccounts',
                    params: []
                }) as string[];
            } catch (error) {
                return throwKeyringRequestFailed("personalSignAction", error as Error);
            }
        }

        if (!connectedAccounts.includes(address)) {
            throw new Error(`User rejected the connection request or connected wrong account for wallet with address ${address}`);
        }

        try {
            return await ethereum.request({
                method: 'personal_sign',
                params: [message, address]
            })
        } catch (error) {
            return throwKeyringRequestFailed("personalSignAction", error as Error);
        }
    }
  },
  render: (signature: string) => (
    <InfoTable info={{
        "Signature": {
            type: "mono",
            data: signature,
        }
    }} />
  )
}