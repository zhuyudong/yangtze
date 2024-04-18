'use client'

import { useSearchParams } from 'next/navigation'
// import { useSession } from '@clerk/nextjs'
import { useSession } from 'next-auth/react'
import { ThemeProvider, useTheme } from 'next-themes'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'
import { TRPCReactProvider } from '@/trpc/react'

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

const Identification = ({ children }: { children: ReactNode }) => {
  // NOTE: `useSession` must be wrapped in a <SessionProvider />
  const { data: session } = useSession()
  const user = session?.user

  const params = useSearchParams()
  const newLoginState = params.get('loginState')

  if (newLoginState === 'signedIn' && session) {
    // TODO: monitor
  }
  useEffect(() => {
    // TODO: monitor
  }, [user])

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeWatcher />
      <TRPCReactProvider>
        <TooltipProvider>
          <Identification>{children}</Identification>
        </TooltipProvider>
      </TRPCReactProvider>
    </ThemeProvider>
  )
}
