import clsx from 'clsx'
import { type Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import type { ReactNode } from 'react'

import { AppShell } from '@/components/patterns/app-shell'
import { TailwindIndicator } from '@/components/patterns/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'
import { AppConfig } from '@/utils/AppConfig'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: {
    template: '%s - Yangtze Snippet',
    default: 'Yangtze Snippet'
  },
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png'
    },
    {
      rel: 'icon',
      url: '/favicon.ico'
    }
  ]
}

export default function RootLayout({
  children,
  params
}: {
  children: ReactNode
  params: { locale: string }
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!AppConfig.locales.includes(params.locale)) notFound()

  // Using internationalization in Client Components
  const messages = useMessages()

  return (
    <html lang={params.locale} className="h-full" suppressHydrationWarning>
      <body className={clsx(`font-sans antialiased  ${inter.variable}`)}>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <AppShell>{children}</AppShell>
        </NextIntlClientProvider>
        <Toaster />
        <TailwindIndicator />
      </body>
    </html>
  )
}
