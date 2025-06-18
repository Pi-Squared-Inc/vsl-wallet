import { throwKeyringRequestFailed } from "@/utils/error";
import { useMetaMaskContext } from "../MetaMaskContext"

export const createAccountAction = {
    name: 'Create Account',
    inputs: [],
    useHandler: () => {
        const { client } = useMetaMaskContext();

        return async () => {
            if (client === null) return;

            try {
                return await client.createAccount();
            } catch (error) {
                return throwKeyringRequestFailed("createAccount", error as Error);
            }
        }
    }
}