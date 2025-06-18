import React from "react";

interface KeyGridProps {
  privateKey: string;
  onChange: (updatedKey: string) => void;
}

export function KeyGrid({ privateKey, onChange }: KeyGridProps) {
  // normalize and validate
  const cleanHex = privateKey.trim().replace(/^0x/, "");
  const isValidHex = /^[0-9A-Fa-f]{64}$/.test(cleanHex);

  // derive boolean bits array
  const bits: boolean[] = React.useMemo(() => {
    if (!isValidHex) return [];
    return cleanHex
      .match(/.{2}/g)!                // split into bytes
      .map((byte) => parseInt(byte, 16))
      .flatMap((b) =>
        Array.from({ length: 8 }, (_, i) => ((b >> (7 - i)) & 1) === 1)
      );
  }, [cleanHex, isValidHex]);


  const toggleBit = (index: number) => {
    if (!isValidHex) return;
    const newBits = bits.map((b, i) => (i === index ? !b : b));
    const bytes = Array.from({ length: 32 }).map((_, byteIdx) => {
      const slice = newBits.slice(byteIdx * 8, byteIdx * 8 + 8);
      const num = slice.reduce(
        (acc, bit, i) => acc | ((bit ? 1 : 0) << (7 - i)),
        0
      );
      return num.toString(16).padStart(2, "0");
    });
    const prefix = privateKey.trim().startsWith("0x") ? "0x" : "";
    onChange(prefix + bytes.join(""));
  };

  if (!isValidHex) return null;

  return (
    <div className="w-full aspect-square border-2 rounded-xl border-gray-400 overflow-hidden">
      <table className="table-fixed border-collapse w-full h-full">
        <tbody>
          {Array.from({ length: 16 }).map((_, row) => (
            <tr key={row}>
              {bits.slice(row * 16, row * 16 + 16).map((bit, col) => (
                <td
                  key={col}
                  onClick={() => toggleBit(row * 16 + col)}
                  className={`w-[6.25%] h-[6.25%] border-[0.25] border-gray-200 cursor-pointer ${
                    bit ? "bg-gray-100/80" : "bg-violet-700/80"
                  }`}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}