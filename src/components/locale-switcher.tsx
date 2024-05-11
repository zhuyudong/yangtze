'use client'

import { useLocale, useTranslations } from 'next-intl'

import { locales } from '@/config'

import { LocaleSwitcherSelect } from './locale-switcher-select'
// import type { ChangeEventHandler } from 'react'

// import { AppConfig } from '@/config'
// import { usePathname, useRouter } from '@/i18n'

export function LocaleSwitcher() {
  // const router = useRouter()
  // const pathname = usePathname()
  // const locale = useLocale()

  // const handleChange: ChangeEventHandler<HTMLSelectElement> = event => {
  //   router.push(pathname, { locale: event.target.value })
  //   router.refresh()
  // }

  // return (
  //   <select
  //     defaultValue={locale}
  //     onChange={handleChange}
  //     className="border border-gray-300 font-medium focus:outline-none focus-visible:ring"
  //   >
  //     {AppConfig.locales.map(elt => (
  //       <option key={elt} value={elt}>
  //         {elt.toUpperCase()}
  //       </option>
  //     ))}
  //   </select>
  // )

  const t = useTranslations('LocaleSwitcher')
  const locale = useLocale()

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t('label')}>
      {locales.map(cur => (
        <option key={cur} value={cur}>
          {t('locale', { locale: cur })}
        </option>
      ))}
    </LocaleSwitcherSelect>
  )
}
