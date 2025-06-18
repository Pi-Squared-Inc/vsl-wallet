import { throwKeyringRequestFailed } from "@/utils/error";
import { useMetaMaskContext } from "../MetaMaskContext"
import { Json } from "@metamask/utils";

export const importAccountAction = {
    name: 'Import Account',
    inputs: [],
    useHandler: () => {
        const { client } = useMetaMaskContext();

        return async (privateKey: string, nonce: number = 0, options: Record<string, Json> = {}) => {
            if (client === null) return;
            console.log("Importing account with nonce", nonce, "and options", options);

            try {
                return await client.createAccount({
                    privateKey, nonce, ...options
                });
            } catch (error) {
                return throwKeyringRequestFailed("importAccount", error as Error);
            }
        }
    }
}