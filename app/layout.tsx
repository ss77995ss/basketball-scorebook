import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import StyledComponentsRegistry from './styled-components-registry';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'On Court Scorebook',
  description: '籃球即時紀錄表',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/basketball-152-184778.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <StyledComponentsRegistry>
          <main>
            <header>
              <nav>
                <Link href="/">進階數據紀錄表</Link>
                <Link href="/turnover">失誤記錄表</Link>
                <Link href="/playerlist">球員名單</Link>
              </nav>
            </header>
            {children}
          </main>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
