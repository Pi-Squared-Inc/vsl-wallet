"use client";
import { getHealthAction } from "@/hooks/actions/getHealth";
import { refreshStateAction } from "@/hooks/actions/refreshState";
import { useMetaMaskContext } from "@/hooks/MetaMaskContext";
import { useMetaMask } from "@/hooks/useMetaMask";
import { useEffect, useState } from "react";

export function StateUpdater() {
  const { installedSnap } = useMetaMask();
  const { reconnecting } = useMetaMaskContext();

  const [countdown, setCountdown] = useState(5);
  const [syncError, setSyncError] = useState(false);

  const refreshState = refreshStateAction.useHandler();
  const getHealth = getHealthAction.useHandler();

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((prev) => (prev === 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (countdown !== 0) return;

    (async () => {
      try {
        if (installedSnap && !reconnecting) {
          await getHealth();
          await refreshState();
        }
        setSyncError(false);
      } catch {
        setSyncError(true);
      } finally {
        setCountdown(5);
      }
    })();
  }, [
    countdown, installedSnap, reconnecting,
    refreshState, getHealth
  ]);

  let indicatorClass = "";
  if (installedSnap === null) {
    indicatorClass = "bg-gray-500";
  } else if (reconnecting) {
    indicatorClass = "bg-yellow-500";
  } else if (syncError) {
    indicatorClass = "bg-red-500";
  } else {
    indicatorClass = "bg-green-500";
  }

  let textContent = "";
  if (installedSnap === null) {
    textContent = "Disconnected";
  } else if (reconnecting) {
    textContent = "Reconnecting";
  } else if (syncError) {
    textContent = "Retry in " + countdown + "s";
  } else {
    textContent = "Syncing in " + countdown + "s";
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={
          "inline-block w-2 h-2 rounded-full transition-colors duration-300 " +
          indicatorClass
        }
      />
      <span className="whitespace-nowrap select-none">
        {textContent}
      </span>
    </div>
  );
}
