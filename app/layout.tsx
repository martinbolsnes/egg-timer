import './globals.css';
import { DynaPuff } from 'next/font/google';
import type React from 'react';

const dynapuff = DynaPuff({ subsets: ['latin'] });

export const metadata = {
  title: 'Retro Egg Timer',
  description: 'A colorful and jazzy egg timer app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link
          href='https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=VT323&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className={dynapuff.className}>{children}</body>
    </html>
  );
}
