"use client";

import { useCallback } from "react";
import clsx from "clsx";

type ToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
};

export default function ToggleSwitch({ checked, onChange, label }: ToggleProps) {
  const handleClick = useCallback(() => onChange(!checked), [checked, onChange]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      className={clsx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
        "duration-200",
        checked
            ? "bg-violet-600 hover:bg-violet-500"
            : "bg-gray-600 hover:bg-gray-500"
      )}
    >
      <span
        className={clsx(
          "inline-block h-4 w-4 transform rounded-full transition-transform duration-200 bg-white",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </button>
  );
}
