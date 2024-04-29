import { createSharedPathnamesNavigation } from 'next-intl/navigation'

import { AppConfig } from '@/config'

export const { usePathname, useRouter } = createSharedPathnamesNavigation({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix as any // LocalePrefix,
})
