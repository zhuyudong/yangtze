import { type Node } from '@markdoc/markdoc'
import type { ReactNode } from 'react'

import { DocsHeader } from '@/components/syntax/DocsHeader'
import { PrevNextLinks } from '@/components/syntax/PrevNextLinks'
import { Prose } from '@/components/syntax/Prose'
import { TableOfContents } from '@/components/syntax/TableOfContents'
import { collectSections } from '@/lib/sections'

export function DocsLayout({
  children,
  frontmatter: { title },
  nodes
}: {
  children: ReactNode
  frontmatter: { title?: string }
  nodes: Array<Node>
}) {
  const tableOfContents = collectSections(nodes)

  return (
    <>
      <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
        <article>
          <DocsHeader title={title} />
          <Prose>{children}</Prose>
        </article>
        <PrevNextLinks />
      </div>
      <TableOfContents tableOfContents={tableOfContents} />
    </>
  )
}
