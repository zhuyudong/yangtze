import '@/styles/tailwind.css'

import type { ReactNode } from 'react'

export default async function RootLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <div className="flex w-full justify-center bg-white dark:bg-zinc-900">
      {children}
    </div>
  )
}
