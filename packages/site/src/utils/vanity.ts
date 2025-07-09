import { Sender } from "@metamask/keyring-snap-client";
import { onKeyringRequest } from "vsl-snap-vanity"
import { defaultSnapOrigin } from "./metamask";

export const VanitySender : Sender = {
    send: async (request) => {
        return await onKeyringRequest({
            origin: defaultSnapOrigin,
            request
        })
    }
}