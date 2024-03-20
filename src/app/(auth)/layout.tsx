// import { enUS, zhCN } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'

export default function AuthLayout(props: {
  children: React.ReactNode
  // params: { locale: string }
}) {
  // const clerkLocale = zhCN
  const signInUrl = '/sign-in'
  const signUpUrl = '/sign-up'
  const dashboardUrl = '/dashboard'

  // if (props.params.locale === 'fr') {
  //   clerkLocale = frFR
  // }

  // if (props.params.locale !== 'en') {
  //   signInUrl = `/${props.params.locale}${signInUrl}`
  //   signUpUrl = `/${props.params.locale}${signUpUrl}`
  //   dashboardUrl = `/${props.params.locale}${dashboardUrl}`
  // }

  return (
    <ClerkProvider
      // localization={clerkLocale}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      afterSignInUrl={dashboardUrl}
      afterSignUpUrl={dashboardUrl}
    >
      {props.children}
    </ClerkProvider>
  )
}
