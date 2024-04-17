import '@/styles/tailwind.css'

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

  return (
    <html lang="en">
      <body>
        {/* NOTE: SessionProvider 可以放在 html 外面，此处 SessionProvider 不能直接从 next-auth/react 导入，需要放在单独的文件中 (如 components/SessionProvider.tsx) 再引入 */}
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
