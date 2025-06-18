import { throwKeyringRequestFailed } from "@/utils/error";
import { useInvokeSnap } from "../useInvokeSnap";
import { InfoTable } from "@/components/index/InfoTable";

export const getHealthAction = {
  name: 'Get Health',
  inputs: [],
  preparer: (id: string) => [id],
  useHandler: () => {
    const invokeSnap = useInvokeSnap();

    return async () => {
      try {
        return await invokeSnap({
          method: 'getHealth',
          params: {}
        })
      } catch (error) {
        return throwKeyringRequestFailed("getHealthAction", error as Error);
      }
    }
  },
  render: (health: string) => (
    <InfoTable info={{
      "Health Status": {
        type: "text",
        data: health,
      }
    }} />
  )
}