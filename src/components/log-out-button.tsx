'use client'

import { signOut } from 'next-auth/react'
// import { useTranslations } from 'next-intl'

const LogOutButton = () => {
  // const t = useTranslations('DashboardLayout')

  return (
    <button
      className="border-none text-gray-700 hover:text-gray-900"
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      {/* {t('sign_out')} */}
      Sign Out
    </button>
  )
}

export { LogOutButton }
