"use client";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

import { useRequestSnap } from '@/hooks/useRequestSnap';
import FlaskFox from '@/icons/flask-fox.svg';
import { useMetaMask } from '@/hooks/useMetaMask';
import Image from 'next/image';

const InstallFlaskButton = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      {...props}
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

export const MetaMaskButton = () => {
  const requestSnap = useRequestSnap();
  const { isFlask, installedSnap } = useMetaMask();

  if (!isFlask && !installedSnap) {
    return <InstallFlaskButton />;
  }

  if (!installedSnap) {
    return <FlaskFoxButton text="Connect" onClick={requestSnap} />;
  }

  if (installedSnap) {
    return <FlaskFoxButton text="Reconnect" onClick={requestSnap} />;
  }
};
