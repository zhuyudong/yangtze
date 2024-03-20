import { type Metadata } from 'next'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import type { ReactNode } from 'react'

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

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode
  params: { locale: string }
}) {
  console.log('RootLayout', params)
  // Validate that the incoming `locale` parameter is valid
  // if (!AppConfig.locales.includes(props.params.locale)) notFound();

  // Using internationalization in Client Components
  const messages = useMessages()

  return (
    <html lang={params.locale} className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full justify-center bg-white antialiased dark:bg-zinc-900">
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
