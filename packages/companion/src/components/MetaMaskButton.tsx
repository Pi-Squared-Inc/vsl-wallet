"use client";
import type { ButtonHTMLAttributes } from 'react';

import { useRequestSnap } from '@/hooks/useRequestSnap';
import FlaskFox from '@/icons/flask-fox.svg';
import type { Snap } from '@metamask/snaps-sdk';
import { isLocalSnap } from '@/utils/metamask'
import { useMetaMask } from '@/hooks/useMetaMask';
import Image from 'next/image';

export const shouldDisplayReconnectButton = (installedSnap: Snap | null) =>
  installedSnap && isLocalSnap(installedSnap?.id);

const InstallFlaskButton = () => (
  <a href="https://metamask.io/flask/" target="_blank">
    <span>Install MetaMask Flask</span>
  </a>
);

const FlaskFoxButton = (props: ButtonHTMLAttributes<HTMLButtonElement> & { text: string }) => {
  return (
    <button
      {...props}
      className="
      bg-white text-black rounded-lg border-2 px-4 py-2.5
      flex flex-row justify-center items-center gap-2.5
      select-none cursor-pointer transition-colors duration-200
      hover:bg-black hover:text-white
      ">
      <Image src={FlaskFox} alt="Flask Fox" />
      <span className="relative font-[550]">{ props.text }</span>
    </button>
  );
}

export const MetaMaskButton = () => {
  const requestSnap = useRequestSnap();
  const { isFlask, installedSnap } = useMetaMask();

  if (!isFlask && !installedSnap) {
    return <InstallFlaskButton />;
  }

  if (!installedSnap) {
    return <FlaskFoxButton text="Connect" onClick={requestSnap} />;
  }

  if (shouldDisplayReconnectButton(installedSnap)) {
    return <FlaskFoxButton text="Reconnect" onClick={requestSnap} />;
  }

  return (
    <div>
      <span>Connected</span>
    </div>
  );
};
