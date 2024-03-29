import '@/styles/tailwind.css'

// import glob from 'fast-glob'
import type { ReactNode } from 'react'

import { Providers } from '@/app/providers'
// import { Layout } from '@/components/syntax/Layout'
import { Layout } from '@/components/Layout'
// import { type Section } from '@/components/SectionProvider'

export default function RootLayout({ children }: { children: ReactNode }) {
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
  // )) as Array<[string, Array<Section>]>
  // const allSections = Object.fromEntries(allSectionsEntries)

  return (
    <Providers>
      <div className="w-full">
        {/* <Layout allSections={allSections}>{children}</Layout> */}
        <Layout>{children}</Layout>
      </div>
    </Providers>
  )
}
