'use client'

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type Atom, Provider } from 'jotai'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ThemeProvider, useTheme } from 'next-themes'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'
import { counterAtom } from '@/store'
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
  // session: { user: { name: string, email: string, image: string }, expires: string }
  const { data: session } = useSession()
  const user = session?.user

  const params = useSearchParams()
  const newLoginState = params.get('loginState')

  if (newLoginState === 'signedIn' && session) {
    // TODO
  }
  useEffect(() => {
    // TODO
  }, [user])

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

// const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  const [initialState] = useSearchParams().get('initialState') || [0]

  return (
    <Provider
      // @ts-expect-error initialValue is not in the types
      initialValues={
        initialState &&
        ([[counterAtom, initialState]] as Iterable<
          readonly [Atom<unknown>, unknown]
        >)
      }
    >
      <ThemeProvider
        enableSystem
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
      >
        <ThemeWatcher />
        {/* <QueryClientProvider client={queryClient}> */}
        <TRPCReactProvider>
          <TooltipProvider>
            <Identification>{children}</Identification>
          </TooltipProvider>
        </TRPCReactProvider>
        {/* </QueryClientProvider> */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </ThemeProvider>
    </Provider>
  )
}
