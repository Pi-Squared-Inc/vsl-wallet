import { throwKeyringRequestFailed } from "@/utils/error";
import { useMetaMaskContext } from "../MetaMaskContext"
import { Json } from "@metamask/utils";
import { useSnapReadyGuard } from "../useSnapReadyGuard";

export const importAccountAction = {
    name: 'Import Account',
    inputs: [],
    useHandler: () => {
        const { client } = useMetaMaskContext();
        const guard = useSnapReadyGuard();

        return async (privateKey: string, options: Record<string, Json> = {}) => {
            guard();

            if (client === null) return;

            try {
                return await client.createAccount({
                    privateKey, ...options
                });
            } catch (error) {
                return throwKeyringRequestFailed("importAccount", error as Error);
            }
        }
    }
}