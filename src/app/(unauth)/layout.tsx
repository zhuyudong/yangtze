import '@/styles/tailwind.css'

import glob from 'fast-glob'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { type Section } from '@/components/SectionProvider'

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pages = await glob('**/*.mdx', { cwd: 'src/app' })
  // NOTE: sections inject by mdx/rehype.mjs rehypePlugins
  const allSectionsEntries = (await Promise.all(
    pages.map(async filename => {
      // replace('(unauth)/', '') (unauth)/vscode/page.mdx -> vscode/page.mdx
      return [
        `/${filename.replace('(unauth)/', '').replace(/(^|\/)page\.mdx$/, '')}`,
        (await import(`./${filename.replace('(unauth)/', '')}`)).sections
      ]
    })
  )) as Array<[string, Array<Section>]>
  const allSections = Object.fromEntries(allSectionsEntries)

  return (
    <Providers>
      <div className="w-full">
        <Layout allSections={allSections}>{children}</Layout>
      </div>
    </Providers>
  )
}