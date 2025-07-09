import type { Metadata } from "next";
import localFont from "next/font/local";
import '@fontsource/iosevka';
import "./globals.css";

const ClashGrotesk = localFont({
  src: [{
    path: '../fonts/ClashGrotesk-Variable.woff2',
    weight: '100 900',
    style: 'normal',
  }],
})

export const metadata: Metadata = {
  title: "VSL Snap Companion",
  description: "A companion app for the VSL Snap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ClashGrotesk.className}>
        {children}
      </body>
    </html>
  );
}
