import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { MouseEventHandler } from 'react'

import { navigation } from '@/libs/navigation'
import { AppConfig } from '@/utils/AppConfig'

// /en|zh-CN/
const localeRegex = new RegExp(`^/(${AppConfig.locales.join('|')})`)

export function Navigation({
  className,
  onLinkClick
}: {
  className?: string
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>
}) {
  const pathname = usePathname()

  return (
    <nav className={clsx('text-base lg:text-sm', className)}>
      {/* space-y-9 */}
      <ul role="list" className="space-y-6">
        {navigation.map(section => (
          <li key={section.title}>
            <h2 className="font-display font-medium text-slate-900 dark:text-white">
              {section.title}
            </h2>
            <ul
              role="list"
              // space-y-2 lg:space-y-4
              className="mt-2 space-y-1 border-l-2 border-slate-100 lg:mt-4 lg:space-y-2 lg:border-slate-200 dark:border-slate-800"
            >
              {section.links.map(link => (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    onClick={onLinkClick}
                    className={clsx(
                      'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:size-1.5 before:-translate-y-1/2 before:rounded-full',
                      link.href === pathname ||
                        pathname.replace(localeRegex, '') === link.href
                        ? 'font-semibold text-sky-500 before:bg-sky-500'
                        : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
                    )}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
