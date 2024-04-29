/* eslint-disable unused-imports/no-unused-vars */
import createMiddleware from 'next-intl/middleware'

import { AppConfig } from './config'

export default createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix as any,
  defaultLocale: AppConfig.defaultLocale
})

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)'
    // Match only internationalized pathnames
    // '/(zh|en)/:path*'
  ]
}
