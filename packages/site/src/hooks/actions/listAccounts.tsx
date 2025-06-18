import { throwKeyringRequestFailed } from "@/utils/error";
import { useMetaMaskContext } from "../MetaMaskContext"
import { useSnapReadyGuard } from "../useSnapReadyGuard";


export const listAccountsAction = {
    name: 'List Accounts',
    inputs: [],
    useHandler: () => {
        const { client } = useMetaMaskContext();
        const guard = useSnapReadyGuard();

        return async () => {
            guard();

            if (client === null) return;

            try {
                return await client.listAccounts();
            } catch (error) {
                return throwKeyringRequestFailed("listAccounts", error as Error);
            }
        }
    }
}