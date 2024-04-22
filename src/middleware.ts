/* eslint-disable unused-imports/no-unused-vars */
// import { redirectToSignIn } from '@clerk/nextjs'
// https://github.com/clerk/javascript/issues/2435
import { authMiddleware, redirectToSignIn } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { AppConfig } from './utils/AppConfig'

// NOTE: 如果不使用 clerk，单独导出此中间件即可
const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix as any,
  defaultLocale: AppConfig.defaultLocale
})

const clerkAuthMiddleware = authMiddleware({
  publicRoutes: (req: NextRequest) =>
    !req.nextUrl.pathname.includes('/dashboard'),
  // ignoredRoutes: ['/(.*\\..*)(.*)', '/(_next)(.*)'],
  beforeAuth: (req: NextRequest) => {
    // Execute next-intl middleware before Clerk's auth middleware
    return intlMiddleware(req)
  },

  // eslint-disable-next-line consistent-return
  afterAuth(auth: { userId: any; isPublicRoute: any }, req: { url: any }) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url })
    }
  }
})

// NOTE: 启用 clerk 时 export
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)'
    // Match only internationalized pathnames
    // '/(zh-CN|en)/:path*'
  ]
}

// export default clerkAuthMiddleware
export default intlMiddleware
