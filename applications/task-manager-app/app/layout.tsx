import { ReadSettings } from '@packages/daisy-ui-components';
import '@packages/daisy-ui-components/global.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';

import './theme.css';

const inter = Inter({ weight: ['500'] });

export const metadata: Metadata = {};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
      <ReadSettings />
    </html>
  );
}
