import { throwKeyringRequestFailed } from "@/utils/error";
import { useMetaMaskContext } from "../MetaMaskContext"
import { InfoTable } from "@/components/index/InfoTable";

export const deleteAccountAction = {
    name: 'Delete Account',
    inputs: [],
    preparer: (id: string) => [id],
    useHandler: () => {
        const { client } = useMetaMaskContext();

        return async (id: string) => {
            if (client === null) return;

            try {
                return await client.deleteAccount(id);
            } catch (error) {
                return throwKeyringRequestFailed("deleteAccount", error as Error);
            }
        }
    },
    render: () => (
        <InfoTable info={{
            "Result": {
                type: "text",
                data: "Success"
            }
        }} />
    )
}