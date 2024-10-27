// @ts-ignore
// import type { LocalePrefix } from 'next-intl/dist/types/src/shared/types'
import type { Pathnames } from 'next-intl/navigation'

// const localePrefix: LocalePrefix = 'never' // 'as-needed'
// Use the default: `always`
export const localePrefix = undefined

export const AppConfig = {
  name: 'yangtze',
  locales: ['en', 'zh'],
  defaultLocale: 'zh',
  localePrefix
}

export const port = process.env.PORT ?? 3000
export const host = process.env.NEXT_PUBLIC_DEPLOYMENT_URL
  ? process.env.NEXT_PUBLIC_DEPLOYMENT_URL
  : `http://localhost:${port}`

export const defaultLocale = 'zh'
export const locales = ['en', 'zh'] as const

export const pathnames = {
  '/': '/',
  '/pathnames': {
    en: '/pathnames',
    zh: '/pathnames'
  }
} satisfies Pathnames<typeof locales>

export type AppPathnames = keyof typeof pathnames
