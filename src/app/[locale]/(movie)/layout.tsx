import '@/styles/movie.css'

import { getServerSession } from 'next-auth'
import type { ReactNode } from 'react'

import SessionProvider from '@/components/SessionProvider'

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: {
  children: ReactNode
}) {
  const session = await getServerSession()

  return <SessionProvider session={session}>{children}</SessionProvider>
}