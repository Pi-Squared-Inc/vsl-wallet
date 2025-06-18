import { throwKeyringRequestFailed } from "@/utils/error";
import { useMetaMaskContext } from "../MetaMaskContext"
import { InfoRow, InfoTable } from "@/components/index/InfoTable";
import { KeyringAccount } from '@metamask/keyring-api';

export const formatAccountInfo = (data: {
  account: KeyringAccount;
  privateKey: string;
  nonce: string;
}): Record<string, InfoRow> => {
  const keyringAccount = data.account;
  const info: Record<string, InfoRow> = {
    ID         : { type: 'mono' , data: keyringAccount.id },
    address    : { type: 'mono' , data: keyringAccount.address },
    type       : { type: 'text' , data: keyringAccount.type },
    methods    : { type: 'chips', data: keyringAccount.methods },
    scopes     : { type: 'chips', data: keyringAccount.scopes },
    privateKey : { type: 'mono', data: data.privateKey },
    nonce      : { type: 'mono', data: data.nonce }
  };

  if (Object.keys(keyringAccount.options).length > 0) {
    info.options = {
      type: 'raw',
      data: keyringAccount.options,
    };
  }

  return info;
};

export const exportAccountAction = {
  name: 'Export Account',
  inputs: [],
  preparer: (id: string) => [id],
  useHandler: () => {
    const { client } = useMetaMaskContext();

    return async (id: string) => {
      if (client === null) return;

      try {
        return await client.exportAccount(id);
      } catch (error) {
        return throwKeyringRequestFailed("exportAccount", error as Error);
      }
    }
  },
  render: (data: any) => (
      <InfoTable info={formatAccountInfo(data)} />
  )
}