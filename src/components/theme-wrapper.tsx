'use client'

import type { ComponentProps, CSSProperties } from 'react'

import { useConfig } from '@/hooks'
import { cn } from '@/lib/utils'

interface ThemeWrapperProps extends ComponentProps<'div'> {
  defaultTheme?: string
}

export function ThemeWrapper({
  defaultTheme,
  children,
  className
}: ThemeWrapperProps) {
  const [config] = useConfig()

  return (
    <div
      className={cn(
        `theme-${defaultTheme || config.theme}`,
        'w-full',
        className
      )}
      style={
        {
          '--radius': `${defaultTheme ? 0.5 : config.radius}rem`
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}
