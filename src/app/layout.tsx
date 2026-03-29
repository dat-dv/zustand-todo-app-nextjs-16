import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import AppToast from '@/components/atoms/toast';

import { AuthProvider } from '@/components/molecules/providers/auth-provider';
import { ConfigProvider } from '@/components/molecules/providers/config-provider';
import { themeScript } from '@/utils/theme-script';
import { ENV_SERVER } from '@/config/server.config';
import { PUBLIC_ENV } from '@/config/public.env.config';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Task Manager',
    default: 'Premium Task Manager - Organize Your Life',
  },
  description:
    'Manage your tasks with elegance and efficiency. A high-performance todo application with real-time focus.',
  metadataBase: new URL(PUBLIC_ENV.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Task Manager',
    title: 'Task Manager - Organize Your Life',
    description: 'The minimalist, high-performance todo application for power users.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Task Manager Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Task Manager - Organize Your Life',
    description: 'The minimalist, high-performance todo application for power users.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/icon.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {ENV_SERVER.IS_DEBUG && (
          <Script
            src="//unpkg.com/react-scan/dist/auto.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-content selection:bg-primary/30">
        <ConfigProvider>
          <AuthProvider>{children}</AuthProvider>
          <AppToast />
        </ConfigProvider>
      </body>
    </html>
  );
}
