import { throwKeyringRequestFailed } from "@/utils/error";
import { useMetaMaskContext } from "../MetaMaskContext"
import { useSnapReadyGuard } from "../useSnapReadyGuard";

export const createAccountAction = {
    name: 'Create Account',
    inputs: [],
    useHandler: () => {
        const { client } = useMetaMaskContext();
        const guard = useSnapReadyGuard();

        return async () => {
            guard();
            if (client === null) return;

            try {
                return await client.createAccount();
            } catch (error) {
                return throwKeyringRequestFailed("createAccount", error as Error);
            }
        }
    }
}