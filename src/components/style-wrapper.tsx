'use client'

import type { HTMLAttributes } from 'react'

import { useConfig } from '@/hooks'

interface StyleWrapperProps extends HTMLAttributes<HTMLDivElement> {
  styleName?: string // Style["name"]
}

export function StyleWrapper({ styleName, children }: StyleWrapperProps) {
  const [config] = useConfig()

  if (!styleName || config.style === styleName) {
    return children
  }

  return null
}
