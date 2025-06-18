import { throwAccountNotFound, throwKeyringRequestFailed } from "@/utils/error";
import { useInvokeSnap } from "../useInvokeSnap";
import { useSnapStoreContext } from "../SnapStoreContext";
import { InfoTable } from "@/components/index/InfoTable";
import { useSnapReadyGuard } from "../useSnapReadyGuard";

export const getBalanceAction = {
    name: 'Get Balance',
    inputs: [],
    preparer: (id: string) => [id],
    useHandler: () => {
        const invokeSnap = useInvokeSnap();
        const { state } = useSnapStoreContext();
        const guard = useSnapReadyGuard();

        return async (id: string) => {
            guard();

            const address = state.accounts[id]?.keyringAccount?.address;

            if (address === undefined) {
                throwAccountNotFound(id);
            }

            try {
                const result = await invokeSnap({
                    method: 'getBalance',
                    params: {
                        address
                    }
                }) as Promise<string>;
                return result;
            } catch (error) {
                return throwKeyringRequestFailed("getBalance", error as Error);
            }
        }
    },
    render: (balance: string) => (
        <InfoTable info={{
            "Balance": {
                type: "text",
                data: String(Number(balance)),
            }
        }} />
    )
}