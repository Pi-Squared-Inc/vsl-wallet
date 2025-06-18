"use client";
import React, { useState } from "react";
import { KeyGrid } from "./KeyGrid";
import { HexInputGrid } from "./HexInputGrid";
import { createAccountAction } from "@/hooks/actions/createAccount";
import { refreshStateAction } from "@/hooks/actions/refreshState";
import { MdAutorenew } from "react-icons/md";
import { importAccountAction } from "@/hooks/actions/importAccount";
import { useSnapStore } from "@/hooks/useSnapStore";
import { Json } from "@metamask/utils";
import z from "zod/v4";

export function AccountCreationAction() {
  const { setError, clearError } = useSnapStore();
  const createAccount = createAccountAction.useHandler();
  const refreshState = refreshStateAction.useHandler();

  const onClick = async () => {
    try {
      await createAccount();
      await refreshState();

      clearError();
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <button
      className="
        bg-white text-black rounded-lg border-2 border-white px-4 py-1.5
        w-full flex flex-row justify-center items-center gap-2.5
        font-[550] cursor-pointer
        hover:bg-black hover:text-white
        transition-colors duration-200 text-lg
      "
      onClick={onClick}
    >
      <span>Create Account</span>
    </button>
  );
}


export function AccountImportAction() {
  const [inputValue, setInputValue] = useState("");

  const cleanHex = inputValue.trim().replace(/^0x/, "");
  const isValidHex = /^[0-9A-Fa-f]{64}$/.test(cleanHex);

  const importAccount = importAccountAction.useHandler();
  const refreshState = refreshStateAction.useHandler();
  const { setError, clearError } = useSnapStore();

  const [ options, setOptions ] = useState<Record<string, Json>>({});

  const onImport = async () => {
    try {
      await importAccount(cleanHex, options);
      await refreshState();

      clearError();
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const getRandomPrivateKey = () =>
    Buffer.from(crypto.getRandomValues(new Uint8Array(32)))

  const generateRandomKey = () => {
    const randomKey = getRandomPrivateKey();
    setInputValue(randomKey.toString("hex"));
  };

  const parseOptions = (value: string) => {
    try {
      return z.record(z.string(), z.json()).parse(JSON.parse(value));
    } catch {
      return {};
    }
  };

  return (
    <div className="
      flex flex-col items-center gap-1.5 w-full pt-2
    ">
      <div className="
        flex flex-col border-2 rounded-lg border-gray-400
        gap-3 w-full p-4
      ">
        <div className="self-start text-xl font-semibold flex flex-row w-full justify-between items-center">
          Private Key
          <MdAutorenew
            className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-200"
            onClick={generateRandomKey}
          />
        </div>
        <div className="-mx-1">
          <HexInputGrid value={inputValue} onChange={(value) => {
            setInputValue(value);
          }} />
        </div>

        {isValidHex && (
          <KeyGrid privateKey={inputValue} onChange={setInputValue} />
        )}

        <div className="flex flex-col">
          <label className="text-gray-200 font-[550] ml-0.5 mb-0.75">Options</label>
          <input
            type="string"
            onChange={(e) => setOptions(parseOptions(e.target.value))}
            className="
              p-2 border-2 border-gray-500 bg-transparent text-gray-200
              hover:border-gray-200 rounded-lg
              focus:outline-none focus:border-violet-500
              transition-colors duration-200
            "
          />
        </div>

      </div>

      <button
        className="
          bg-white text-black rounded-lg border-2 border-white
          px-4 py-2 w-full font-[550] cursor-pointer
          hover:bg-black hover:text-white
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:bg-white
          disabled:hover:text-black text-lg
        "
        onClick={onImport}
        disabled={!isValidHex}
      >
        Import Account
      </button>
    </div>
  );
}
