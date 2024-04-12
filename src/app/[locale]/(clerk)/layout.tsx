import { enUS, zhCN } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import type { ReactNode } from 'react'

export default function AuthLayout({
  params,
  children
}: {
  children: ReactNode
  params: { locale: string }
}) {
  let clerkLocale = zhCN
  let signInUrl = '/sign-in'
  let signUpUrl = '/sign-up'
  let dashboardUrl = '/dashboard'

  if (params.locale === 'en') {
    clerkLocale = enUS
  }

  if (params.locale !== 'zh-CN') {
    signInUrl = `/${params.locale}${signInUrl}`
    signUpUrl = `/${params.locale}${signUpUrl}`
    dashboardUrl = `/${params.locale}${dashboardUrl}`
  }

  return (
    <ClerkProvider
      localization={clerkLocale}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      afterSignInUrl={dashboardUrl}
      afterSignUpUrl={dashboardUrl}
    >
      {children}
    </ClerkProvider>
  )
}
