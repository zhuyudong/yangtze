// @ts-ignore
import type { LocalePrefix } from 'next-intl/dist/types/src/shared/types'

const localePrefix: LocalePrefix = 'never' // 'as-needed'

export const AppConfig = {
  name: 'yangtze',
  locales: ['en', 'zh'],
  defaultLocale: 'zh',
  localePrefix
}
