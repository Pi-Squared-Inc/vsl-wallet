"use client";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

import { useRequestSnap } from '@/hooks/useRequestSnap';
import FlaskFox from '@/icons/flask-fox.svg';
import { useMetaMask } from '@/hooks/useMetaMask';
import Image from 'next/image';
import type { Snap } from '@metamask/snaps-sdk';

const InstallFlaskButton = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      {...props}
      href="https://docs.metamask.io/snaps/get-started/install-flask/"
      target="_blank"
      rel="noopener noreferrer"
      className="
      bg-white text-black rounded-lg border-2 px-4 py-2.5
      flex flex-row justify-center items-center gap-2.5
      select-none cursor-pointer transition-colors duration-200
      hover:bg-black hover:text-white
      ">
      <span className="relative font-[550]">Install MetaMask Flask</span>
    </a>
  );
}

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

export const shouldDisplayReconnectButton = (installedSnap: Snap | null) =>
  installedSnap && isLocalSnap(installedSnap?.id);

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');

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

  return <div className="
    bg-transparent rounded-lg px-4 py-2.5
    border-gray-400 border-2 text-gray-400
    flex flex-row justify-center items-center gap-2.5
    select-none cursor-default transition-colors duration-200
    ">
    <span className="relative font-[550]">Connected</span>
  </div>
};
