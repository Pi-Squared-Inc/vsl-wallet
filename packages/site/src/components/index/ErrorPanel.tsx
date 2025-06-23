"use client";

import { useSnapStoreContext } from "@/hooks/SnapStoreContext";

export function ErrorPanel() {
  const { state } = useSnapStoreContext();
  const { error } = state;

  return (
    <div className={`overflow-hidden transition-all duration-200 ${
      error !== undefined && error.length > 0 ? 'max-h-40' : 'max-h-0'
    }`}>
      {error !== undefined && error.length > 0 && (
        <div className="whitespace-pre-wrap border-2 border-red-500 text-red-500 p-2 rounded-lg font-[500] text-lg px-4">
          <h2>{error}</h2>
        </div>
      )}
    </div>
  );
}