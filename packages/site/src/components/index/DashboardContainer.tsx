"use client";
import { BreakPointHooks, breakpointsTailwind } from "@react-hooks-library/core";
import { AccountCreationAction, AccountImportAction } from "./AccountAction";
import { AccountList } from "./AccountList";
import { AccountInfoPanel } from "./AccountInfoPanel";
import { AccountActionPanel } from "./AccountActionPanel";
import { ErrorPanel } from "./ErrorPanel";
import { JSX, ReactNode } from "react";
import { useMetaMask } from "@/hooks/useMetaMask";

export function AccountPanel() {
  return (<div className="flex flex-col gap-1">
    <AccountList />
    <AccountCreationAction />
    <AccountImportAction />
  </div>)
}

export function DashboardContainer() {
  const { installedSnap } = useMetaMask();
  const { useGreater, useBetween } = BreakPointHooks(breakpointsTailwind);

  const greaterThanXl   = useGreater('xl');
  const betweenMdAndXl  = useBetween('md', 'xl');

  if (!installedSnap) {
    return (
      <div className="flex flex-col gap-2 border-2 rounded-lg p-4 border-gray-500">
        <h2 className="text-xl font-semibold text-gray-200">Snap not connected!</h2>
        <p className="text-gray-400">Click Connect button to start using VSL Snap Dashboard</p>
      </div>
    )
  }

  let layout: JSX.Element | ReactNode = null;
  if (greaterThanXl) {
    layout = (
      <div className="flex flex-row gap-4">
        <div className="w-2/7 order-1">
          <AccountPanel />
        </div>

        <div className="w-5/14 order-2">
          <AccountInfoPanel />
        </div>

        <div className="w-5/14 order-3">
          <AccountActionPanel />
        </div>
      </div>
    );
  }

  else if (betweenMdAndXl) {
    layout = (
        <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-4 w-1/2">
                <AccountInfoPanel />
                <AccountPanel />
            </div>

            <div className="flex-1">
                <AccountActionPanel />
            </div>
        </div>
    );
  }

  else {
    layout = (
      <div className="flex flex-col gap-4">
        <AccountInfoPanel />
        <AccountActionPanel />
        <AccountPanel />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <ErrorPanel />
      {layout}
    </div>
  );
}
