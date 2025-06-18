"use client";
import { getHealthAction } from "@/hooks/actions/getHealth";
import { refreshStateAction } from "@/hooks/actions/refreshState";
import { useEffect, useState } from "react";

export function StateUpdater() {
  const [countdown, setCountdown] = useState(5);
  const [syncError, setSyncError] = useState(false);
  const refreshState = refreshStateAction.useHandler();
  const getHealth = getHealthAction.useHandler();

  /* Tick the countdown every second */
  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((prev) => (prev === 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  /* When countdown hits 0, attempt to refresh */
  useEffect(() => {
    if (countdown !== 0) return;

    (async () => {
      try {
        await getHealth();
        await refreshState();
        setSyncError(false);
      } catch {
        setSyncError(true);
      } finally {
        setCountdown(5);
      }
    })();
  }, [countdown, refreshState, getHealth]);

  const indicatorClass = syncError ? "bg-red-500" : "bg-green-500";

  return (
    <div className="flex items-center gap-2">
      {/* Status indicator */}
      <span
        className={
          "inline-block w-2 h-2 rounded-full transition-colors duration-300 " +
          indicatorClass
        }
      />
      <span className="whitespace-nowrap">
        {syncError ? "Retry" : "Sync"} in {countdown}s
      </span>
    </div>
  );
}
