import { throwKeyringRequestFailed } from "@/utils/error";
import { useMetaMaskContext } from "../MetaMaskContext"
import { Json } from "@metamask/utils";
import { useSnapStoreContext } from "../SnapStoreContext";

export const updateAccountAction = {
    name: 'Update Account',
    inputs: [],
    useHandler: () => {
        const { client } = useMetaMaskContext();
        const { state } = useSnapStoreContext();

        return async (id: string, options: Record<string, Json>) => {
            if (client === null) return;

            const account = state.accounts[id]?.keyringAccount;

            try {
                return await client.updateAccount({
                    ...account,
                    options,
                });
            } catch (error) {
                return throwKeyringRequestFailed("updateAccount", error as Error);
            }
        }
    }
}