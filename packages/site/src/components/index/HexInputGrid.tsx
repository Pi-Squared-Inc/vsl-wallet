"use client";
import React, { useRef, useState, useEffect } from "react";

interface HexInputGridProps {
  value?: string;
  onChange: (key: string) => void;
  prefix0x?: boolean;
}

const HEX64 = /^[0-9a-fA-F]{64}$/;
const HEX64_0X = /^0x[0-9a-fA-F]{64}$/;

export function HexInputGrid({ value = "", onChange, prefix0x = false }: HexInputGridProps) {
  /* state */
  const [digits, setDigits] = useState<string[]>(() => {
    const raw = value.startsWith("0x") ? value.slice(2) : value;
    return Array.from({ length: 64 }).map((_, i) => raw[i]?.toLowerCase() ?? "");
  });
  const refs = useRef<Array<HTMLInputElement | null>>(Array(64).fill(null));

  const emit = (arr: string[]) => {
    if (arr.every(Boolean)) {
      onChange((prefix0x ? "0x" : "") + arr.join(""));
      return;
    } else {
      onChange("");
    }
  }
  const focus = (i: number) => refs.current[i]?.focus();
  const keyString = (include0x = false) => (include0x ? "0x" : "") + digits.map((d) => d || "0").join("");


  const fill = (hex: string) => {
    const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
    if (!HEX64.test(clean)) return;
    const arr = Array.from(clean.toLowerCase());
    setDigits(arr);
    emit(arr);
    focus(0);
  };

  /* events */
  const onKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key, metaKey, ctrlKey } = e;

    if ((metaKey || ctrlKey) && key.toLowerCase() === "c") {
      e.preventDefault();
      navigator.clipboard.writeText(keyString(prefix0x));
      return;
    }

    if (/^[0-9a-fA-F]$/.test(key)) {
      e.preventDefault();
      const arr = [...digits];
      arr[idx] = key.toLowerCase();
      setDigits(arr);
      emit(arr);
      if (idx < 63) focus(idx + 1);
      return;
    }

    if (key === "Backspace") {
      e.preventDefault();
      const arr = [...digits];
      if (arr[idx]) arr[idx] = "";
      else if (idx > 0) {
        arr[idx - 1] = "";
        focus(idx - 1);
      }
      setDigits(arr);
      emit(arr);
      return;
    }

    const move = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -16, ArrowDown: 16 } as const;
    if (key in move) {
      const t = idx + move[key as keyof typeof move];
      if (t >= 0 && t < 64) {
        e.preventDefault();
        focus(t);
      }
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text/plain").trim();
    if (HEX64.test(text) || HEX64_0X.test(text)) {
      e.preventDefault();
      fill(text);
    }
  };

  useEffect(() => {
    const raw = value.startsWith("0x") ? value.slice(2) : value;
    if (HEX64.test(raw)) setDigits(Array.from(raw.toLowerCase()));
  }, [value]);

  /* render */
  return (
    <div className={`mx-auto space-y-2 select-none`}>
      {Array.from({ length: 4 }).map((_, r) => (
        <div key={r} className="flex">
          {Array.from({ length: 16 }).map((_, c) => {
            const i = r * 16 + c;
            return (
              <input
              key={c}
              ref={(el) => (refs.current[i] = el, undefined)}
              readOnly
              type="text"
              inputMode="none"
              maxLength={1}
              value={digits[i].toUpperCase()}
              placeholder="0"
              onKeyDown={(e) => onKey(i, e)}
              onPaste={onPaste}
              onFocus={(e) => e.currentTarget.setSelectionRange(0, 0)}
              className={`
                flex-1 w-[min(1.25rem,6.25%)] text-center bg-transparent border-gray-500 py-1 text-lg
                font-iosevka placeholder-gray-500 focus:outline-none focus:border-white
                focus:text-gray-200 focus:bg-violet-700 caret-transparent h-7 font-bold
                text-gray-200 rounded-sm select-none
              `}
              style={{ userSelect: "none" }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
