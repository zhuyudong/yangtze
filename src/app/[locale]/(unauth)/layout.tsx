import '@/styles/tailwind.css'

import { getServerSession } from 'next-auth'
// import glob from 'fast-glob'
import type { ReactNode } from 'react'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/layout'
import { type Section } from '@/components/section-provider'
import SessionProvider from '@/components/session-provider'
import { navigationOfZh } from '@/lib/navigation'

export default async function RootLayout({
  children
}: {
  children: ReactNode
}) {
  // const locale = useLocale()
  // const pages = await glob('**/*.mdx', { cwd: 'src/app/[locale]' })
  // NOTE: sections inject by mdx/rehype.mjs rehypePlugins
  // const allSectionsEntries = (await Promise.all(
  //   pages.map(async filename => {
  //     console.log('filename', filename, filename.replace('(unauth)/', ''))
  //     // replace('(unauth)/', '') (unauth)/vscode/page.mdx -> vscode/page.mdx
  //     return [
  //       `/${filename
  //         // .replace('[locale]/', '')
  //         .replace('(unauth)/', '')
  //         .replace(/(^|\/)page\.mdx$/, '')}`,
  //       (await import(`./${filename.replace('(unauth)/', '')}`)).sections
  //     ]
  //   })
  // )) as [string, Section[]][]
  // const allSections = Object.fromEntries(allSectionsEntries)
  const allSections = navigationOfZh
    .map(group => group.links)
    .flat()
    .reduce(
      (acc, link) => {
        acc[link.href] = []
        return acc
      },
      {} as Record<string, Section[]>
    )

  const session = await getServerSession()

  return (
    <SessionProvider session={session}>
      <Providers>
        <div className="w-full bg-white dark:bg-zinc-900">
          <Layout allSections={allSections}>{children}</Layout>
        </div>
      </Providers>
    </SessionProvider>
  )
}
