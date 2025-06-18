import { throwKeyringRequestFailed } from "@/utils/error";
import { useMetaMaskContext } from "../MetaMaskContext"

export const listAccountsAction = {
    name: 'List Accounts',
    inputs: [],
    useHandler: () => {
        const { client } = useMetaMaskContext();
        return async () => {
            if (client === null) return;

            try {
                return await client.listAccounts();
            } catch (error) {
                return throwKeyringRequestFailed("listAccounts", error as Error);
            }
        }
    }
}