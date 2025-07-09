"use client";

import { VSLAccount } from "@/hooks/AccountStoreContext";
import { useAccountStoreContext } from "@/hooks/AccountStoreContext";
import { InfoRow, InfoTable } from "./InfoTable";

const formatAssetId = (assetId: string) => {
  return `${assetId.slice(0, 7)}…${assetId.slice(-5)}`;
}

export const formatAccountInfo = (account: VSLAccount | null): Record<string, InfoRow> => {
  if (account === null) {
    return {};
  }
  const keyringAccount = account.keyringAccount;
  const info: Record<string, InfoRow> = {
    ID      : { type: 'mono' , data: keyringAccount.id },
    address : { type: 'mono' , data: keyringAccount.address },
    type    : { type: 'text' , data: keyringAccount.type },
    methods : { type: 'chips', data: keyringAccount.methods },
    scopes  : { type: 'chips', data: keyringAccount.scopes },
    balance : { type: 'text' , data: String(Number(account.balance)) }
  };

  if (keyringAccount.options && Object.keys(keyringAccount.options).length > 0) {
    info.options = {
      type: 'raw',
      data: keyringAccount.options,
    };
  }

  if (account.assets && Object.keys(account.assets).length > 0) {
    const assets: Record<string, InfoRow> = {};
    const entries = Object.entries(account.assets).sort(([aId], [bId]) => aId.localeCompare(bId));
    for (const [assetId, balance] of entries) {
      const assetMap = keyringAccount.options?.assets;
      const assetName = (assetMap as Record<string, string>)?.[assetId] ?? '';
      assets[formatAssetId(assetId)] = {
        type: 'text',
        data: `${String(Number(balance))} ${assetName.toUpperCase()}`,
        keyType: 'mono',
        rawKey: assetId
      };
    }
    info.assets = { type: 'table', data: assets }
  }

  return info;
};



export function AccountInfoPanel() {
  const { state } = useAccountStoreContext();

  const { accounts, selectedAccountId } = state;

  const account = selectedAccountId
    ? accounts[selectedAccountId]
    : null;

  return (
    <div className="flex flex-col gap-2 border-2 rounded-lg p-4 border-gray-500">
      <h2 className="text-xl font-semibold text-gray-200">Account Information</h2>
      {account ? (
        <InfoTable info={formatAccountInfo(account)} />
      ) : (
        <p className="text-gray-400">Select an account to see its information</p>
      )}
    </div>
  );
}
