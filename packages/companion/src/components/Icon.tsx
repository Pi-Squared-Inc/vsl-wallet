import Image from 'next/image';
import Pi2Icon from '@/icons/pi2-logo.png';

export const Pi2NetworkButton = () => (
  <a
    href="https://pi2.network"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Go to pi2.network"
    className="inline-block cursor-pointer"
  >
    <Image src={Pi2Icon} alt="Pi2 Network Logo" width={80} height={80} />
  </a>
);

export const IconButton = ({ children, disabled, onClick, ...props }: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center justify-center p-2
      bg-transparent border-none cursor-pointer
      text-gray-500 hover:border-none
      disabled:opacity-40 disabled:cursor-not-allowed
    `}
    {...props}
  >
    {children}
  </button>
);
