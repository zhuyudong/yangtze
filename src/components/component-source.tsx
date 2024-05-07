'use client'

import type { HTMLAttributes } from 'react'

import { CodeBlockWrapper } from '@/components/code-block-wrapper'
import { cn } from '@/lib/utils'

interface ComponentSourceProps extends HTMLAttributes<HTMLDivElement> {
  src: string
}

export function ComponentSource({
  children,
  className,
  ...props
}: ComponentSourceProps) {
  return (
    <CodeBlockWrapper
      expandButtonTitle="Expand"
      className={cn('my-6 overflow-hidden rounded-md', className)}
      {...props}
    >
      {children}
    </CodeBlockWrapper>
  )
}
