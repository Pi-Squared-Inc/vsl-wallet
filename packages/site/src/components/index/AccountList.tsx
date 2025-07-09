"use client";
import { useMetaMask } from "@/hooks/useMetaMask";
import { useAccountStoreContext } from "@/hooks/AccountStoreContext";
import { useEffect } from "react";
import { refreshStateAction } from "@/hooks/actions/refreshState";
import { useAccountStore } from "@/hooks/useAccountStore";


type AccountRowProps = {
  text: string;
  selected?: boolean;
  onClick?: () => void;
}

function AccountRow ({ text, onClick, selected }: AccountRowProps) {
  const selectedClass = selected
    ? "bg-violet-700 border-violet-700 hover:border-violet-200"
    : "bg-transparent"

  return (
    <div
      className={`
        rounded-lg px-4 py-2 border-2 text-gray-50
        border-gray-500 hover:border-gray-200 font-iosevka font-bold
        transition-colors duration-200 cursor-pointer
        ${selectedClass}
      `}
      onClick={onClick}
    >
      {text}
    </div>
  );
}

export function AccountList () {
  const { installedSnap } = useMetaMask();
  const { state } = useAccountStoreContext();
  const { setError } = useAccountStore();
  const { selectAccountId } = useAccountStore();

  const refreshState = refreshStateAction.useHandler();

  useEffect(() => {
    (async () => {
      try {
        await refreshState();
      } catch (error) {
        setError((error as Error).message);
      }
    })();
    // You cannot add refreshState to the dependency array here,
    // because it would cause an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installedSnap]);

  const format = (address: string) => {
    return `${address.slice(0, 9)}…${address.slice(-7)}`;
  };

  return (
    <div className="flex flex-col gap-1">
      {Object.keys(state.accounts).length === 0 && (
        <AccountRow text="No accounts found. Create one!" />
      )}
      {Object.keys(state.accounts).map((id) => {
        const account = state.accounts[id].keyringAccount;
        return (
          <AccountRow
            key={id}
            selected={id === state.selectedAccountId}
            text={format(account.address)}
            onClick={() => selectAccountId(id) }
          />
        );
      })}
    </div>
  );
}