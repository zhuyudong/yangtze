 
import createMiddleware from 'next-intl/middleware'

import { defaultLocale, localePrefix, locales, pathnames } from './config'

export default createMiddleware({
  defaultLocale,
  locales,
  pathnames,
  localePrefix
})

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    // Match only internationalized pathnames
    // Set a cookie to remember the previous locale for all requests that have a locale prefix
    '/(zh|en)/:path*',
    // Enable redirects that add missing locales, (e.g. `/` -> `/en`)
    '/((?!_next|_vercel|.*\\..*).*)',
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/(api|trpc)(.*)'
  ]
}
