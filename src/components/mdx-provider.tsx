'use client'

import { MDXProvider as MDXProvider_ } from '@mdx-js/react'
import type { ReactNode } from 'react'

import { components } from '@/components/mdx-components'

export const MDXProvider = ({ children }: { children: ReactNode }) => {
  // @ts-expect-error types are not ideal here but it works
  return <MDXProvider_ components={components}>{children}</MDXProvider_>
}
