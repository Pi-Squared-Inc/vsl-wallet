import { throwKeyringRequestFailed } from "@/utils/error";
import { useMetaMaskContext } from "../MetaMaskContext"
import { Json } from "@metamask/utils";
import { useAccountStoreContext } from "../AccountStoreContext";
import { useSnapReadyGuard } from "../useSnapReadyGuard";

export const updateAccountAction = {
    name: 'Update Account',
    inputs: [],
    useHandler: () => {
        const { client } = useMetaMaskContext();
        const { state } = useAccountStoreContext();
        const guard = useSnapReadyGuard();

        return async (id: string, options: Record<string, Json>) => {
            guard();

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