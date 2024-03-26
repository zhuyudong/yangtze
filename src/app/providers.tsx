'use client'

import { SessionProvider } from 'next-auth/react'
import { useTheme } from 'next-themes'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

import { TailwindIndicator } from '@/components/TailwindIndicator'
import { ThemeProvider } from '@/components/ThemeProvider'

function ThemeWatcher() {
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    function onMediaChange() {
      const systemTheme = media.matches ? 'dark' : 'light'
      if (resolvedTheme === systemTheme) {
        setTheme('system')
      }
    }

    onMediaChange()
    media.addEventListener('change', onMediaChange)

    return () => {
      media.removeEventListener('change', onMediaChange)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeWatcher />
      <SessionProvider>{children}</SessionProvider>
      <Toaster />
      <TailwindIndicator />
    </ThemeProvider>
  )
}
