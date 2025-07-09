"use client";
import { useAccountStoreContext } from "@/hooks/AccountStoreContext";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import React, { useState } from "react";
import { useAccountStore } from "@/hooks/useAccountStore";
import { refreshStateAction } from "@/hooks/actions/refreshState";
import { transferBalanceAction } from "@/hooks/actions/transferBalance";
import { throwInvalidParameter } from "@/utils/error";
import { createAssetAction } from "@/hooks/actions/createAsset";
import { exportAccountAction } from "@/hooks/actions/exportAccount";
import { getAssetBalanceAction } from "@/hooks/actions/getAssetBalance";
import { getAssetBalancesAction } from "@/hooks/actions/getAssetBalances";
import { getBalanceAction } from "@/hooks/actions/getBalance";
import { getHealthAction } from "@/hooks/actions/getHealth";
import { submitClaimAction } from "@/hooks/actions/submitClaim";
import { deleteAccountAction } from "@/hooks/actions/deleteAccount";
import { transferAssetAction } from "@/hooks/actions/transferAsset";
import { personalSignAction } from "@/hooks/actions/personalSign";
import ToggleSwitch from "./SwitchButton";
import { RawTextArea } from "../RawTextArea";


type AccountActionDropdownProps = {
  actions: any[];
  selectedActionIndex: number;
  onChange: (action: number) => void;
}

export function AccountActionDropdown({ actions, selectedActionIndex, onChange }: AccountActionDropdownProps) {
  return (<Listbox value={selectedActionIndex} onChange={onChange}>
    <div className="relative w-full">
      <ListboxButton
        className="
          w-full p-2 pl-3 pr-8
          border-2 border-gray-500 rounded-lg
          text-gray-200 text-lg font-[550]
          flex justify-between items-center
          cursor-pointer
          hover:border-gray-200
          transition-colors duration-200
          focus:outline-none
        "
      >
        { actions[selectedActionIndex]?.name ?? "Select Action" }
      </ListboxButton>
      <ListboxOptions
        className="
          absolute mt-1 w-full py-2
          bg-black border-2 border-gray-500 rounded-lg
          overflow-hidden z-10
        "
      >
        {actions.map((action, index) => (
          <ListboxOption
            key={index}
            value={index}
            className={`
              px-3 py-2 font-[550] text-lg
              cursor-pointer
              ${index === selectedActionIndex
                ? "bg-violet-700"
                : ""
              }
            `}
          >
            { action.name }
          </ListboxOption>
        ))}
      </ListboxOptions>
    </div>
  </Listbox>)
}

export function AccountActionPanel() {
  const { state } = useAccountStoreContext();
  const { setInput, setError, clearError } = useAccountStore();
  const [ selectedActionIndex, setSelectedActionIndex ] = useState<number>(-1);
  const [ response, setResponse ] = useState<any | undefined>(undefined);
  const refreshState = refreshStateAction.useHandler();
  const [ formattedResponse, setFormattedResponse ] = useState<boolean>(true);

  const { accounts, selectedAccountId } = state;

  const account = selectedAccountId
    ? accounts[selectedAccountId]
    : null;

  const actions = [
    transferBalanceAction,
    transferAssetAction,
    createAssetAction,
    exportAccountAction,
    getAssetBalanceAction,
    getAssetBalancesAction,
    getBalanceAction,
    getHealthAction,
    submitClaimAction,
    deleteAccountAction,
    personalSignAction,
  ];

  const handlers = [
    transferBalanceAction.useHandler(),
    transferAssetAction.useHandler(),
    createAssetAction.useHandler(),
    exportAccountAction.useHandler(),
    getAssetBalanceAction.useHandler(),
    getAssetBalancesAction.useHandler(),
    getBalanceAction.useHandler(),
    getHealthAction.useHandler(),
    submitClaimAction.useHandler(),
    deleteAccountAction.useHandler(),
    personalSignAction.useHandler(),
  ]

  const selectedAction = actions[selectedActionIndex]

  const onSelectChange = (actionIndex: number) => {
    setSelectedActionIndex(actionIndex);
    setResponse(undefined);
  }

  const onInputChange = (inputId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(inputId, e.target?.value);
  }

  const onSubmit = async () => {
    let inputs;
    try {
      inputs = selectedAction.inputs.map(input => {
        const result = state.inputs[`${selectedAction.name} ${input.name}`];
        const parsedResult = input.schema.safeParse(result);
        if (!parsedResult.success) {
          return throwInvalidParameter(selectedAction.name, input.name, parsedResult.error);
        }

        return [input.name, parsedResult.data]
      });
    } catch (error) {
      setError((error as Error).message);
      return;
    }

    const parameters = selectedAction.preparer(selectedAccountId!, Object.fromEntries(inputs))
    try {
      const result = await (handlers[selectedActionIndex] as any)(...parameters as any);
      await refreshState();

      setResponse(result);
      clearError();
    } catch (error) {
      setError((error as Error).message);
    }
  }

  return (<div className="flex flex-col gap-2 border-2 rounded-lg p-4 border-gray-500">
    <div className="flex justify-between items-baseline mb-1">
      <h2 className="text-xl font-semibold text-gray-200">Account Actions</h2>{
        selectedAction && response &&
        <div className={`flex items-center gap-2 font-[500] ${formattedResponse ? "text-purple-400" : "text-gray-400"}`}>
          { formattedResponse ? "Formatted" : "Raw" }
          <ToggleSwitch checked = { formattedResponse } onChange = { setFormattedResponse }/>
        </div>
      }
    </div>
    {account ? (<div className="flex flex-col">
      <div className="flex gap-2 items-center justify-center pb-1">
        <div className="flex-1">
          <AccountActionDropdown
            actions={actions}
            selectedActionIndex={selectedActionIndex}
            onChange={onSelectChange}
          />
        </div>
        <button
          className="
          px-4 self-stretch rounded-lg font-[550] bg-white text-black
          disabled:bg-gray-600 disabled:cursor-not-allowed
          disabled:text-gray-400 cursor-pointer border-2
          disabled:border-gray-600
          hover:bg-black hover:text-white
          transition-colors duration-200
          text-lg
          "
          disabled={selectedAction === undefined}
          onClick={async () => {
            onSubmit();
          }}
        >
          Submit
        </button>
      </div>{
        selectedAction !== undefined && selectedAction.inputs.length !== 0 &&
        <div className="flex flex-col gap-2.5 pt-3 pb-1"> {
          selectedAction.inputs.map((input, index) => (
            <div key={`${input.name}-${index}`} className="flex flex-col">
              <label className="text-gray-200 font-[550] ml-0.5 mb-0.75">{input.name}</label>
              <input
                type={input.type}
                value={state.inputs[`${selectedAction.name} ${input.name}`] ?? ""}
                className="
                  p-2 border-2 border-gray-500 bg-transparent text-gray-200
                  hover:border-gray-200 rounded-lg
                  focus:outline-none focus:border-violet-500
                  transition-colors duration-200
                "
                onChange={onInputChange(`${selectedAction.name} ${input.name}`)}
              />
            </div>
          ))
        } </div>
      } { selectedAction && response && (
        <div className={`pt-2.5 ${formattedResponse ? "pl-1.25 pr-0.25" : ""}`}>{
          formattedResponse
            ? selectedAction.render?.(response, state)
            : <RawTextArea className="break-all" value={JSON.stringify(response, null, 2)} />
        }</div>
      ) }
    </div>) : (
      <p className="text-gray-400">Select an account to see its actions</p>
    )}
  </div>);
}
