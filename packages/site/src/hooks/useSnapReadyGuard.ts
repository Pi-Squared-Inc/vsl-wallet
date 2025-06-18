import { throwSnapIsReconnecting, throwSnapNotConnected } from "@/utils/error";
import { useMetaMaskContext } from "./MetaMaskContext";

export const useSnapReadyGuard = () => {
    const { installedSnap, reconnecting } = useMetaMaskContext();

    return () => {
        if (installedSnap === null) {
            throwSnapNotConnected();
        }

        if (reconnecting) {
            throwSnapIsReconnecting();
        }
    }
}