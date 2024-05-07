'use client'

import { allPosts } from 'contentlayer/generated'
import type { HTMLAttributes } from 'react'

import { Mdx } from './contentlayer-mdx'

interface FrameworkDocsProps extends HTMLAttributes<HTMLDivElement> {
  data: string
}

export function FrameworkDocs({ ...props }: FrameworkDocsProps) {
  const frameworkDoc = allPosts.find(
    doc => doc.slug === `/docs/installation/${props.data}`
  )

  if (!frameworkDoc) {
    return null
  }

  return <Mdx code={frameworkDoc.body.code} />
}
