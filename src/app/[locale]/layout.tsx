import clsx from 'clsx'
import { type Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import localFont from 'next/font/local'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import type { ReactNode } from 'react'

// import { getCurrentUser } from "@/lib/session"
import { AppConfig } from '@/utils/AppConfig'
// import { UserInfo } from '@/types/user'

const fontHeading = localFont({
  src: '../../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading'
})
export const fontSans = FontSans({
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

  // const user = (await getCurrentUser()) as UserInfo;

  return (
    <html lang={params.locale} className="h-full" suppressHydrationWarning>
      <body
        className={clsx(
          'bg-background flex min-h-full justify-center font-sans antialiased dark:bg-zinc-900',
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
