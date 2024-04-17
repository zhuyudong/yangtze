import clsx from 'clsx'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import type { CSSProperties, ElementRef, ReactNode } from 'react'
import { forwardRef } from 'react'

import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
  useMobileNavigationStore
} from '@/components/MobileNavigation'
import { MobileSearch, Search } from '@/components/Search'
import { ThemeToggle } from '@/components/ThemeToggle'

export function TopLevelNavItem({
  href,
  children
}: {
  href: string
  children: ReactNode
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

// export async function generateMetadata(props: { params: { locale: string } }) {
//   const t = await getTranslations({
//     locale: props.params.locale,
//     namespace: 'RootLayout'
//   })

//   return {
//     title: t('sign_in_link')
//   }
// }

export const Header = forwardRef<ElementRef<'div'>, { className?: string }>(
  function Header({ className }, ref) {
    // const t = getTranslations('RootLayout')

    const { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
    const isInsideMobileNavigation = useIsInsideMobileNavigation()

    const { scrollY } = useScroll()
    const bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
    const bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

    return (
      <motion.div
        ref={ref}
        className={clsx(
          className,
          'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80',
          !isInsideMobileNavigation &&
            'backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80',
          isInsideMobileNavigation
            ? 'bg-white dark:bg-zinc-900'
            : 'bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]'
        )}
        style={
          {
            '--bg-opacity-light': bgOpacityLight,
            '--bg-opacity-dark': bgOpacityDark
          } as CSSProperties
        }
      >
        <div
          className={clsx(
            'absolute inset-x-0 top-full h-px transition',
            (isInsideMobileNavigation || !mobileNavIsOpen) &&
              'bg-zinc-900/7.5 dark:bg-white/7.5'
          )}
        />
        <Search />
        <div className="flex items-center gap-5 lg:hidden">
          <MobileNavigation />
          <Link href="/" aria-label="Home">
            <Logo className="h-6" />
          </Link>
        </div>
        <div className="flex items-center gap-5">
          {/* <nav className="hidden md:block">
          <ul role="list" className="flex items-center gap-8">
            <TopLevelNavItem href="/">API</TopLevelNavItem>
            <TopLevelNavItem href="#">Documentation</TopLevelNavItem>
            <TopLevelNavItem href="#">Support</TopLevelNavItem>
          </ul>
        </nav> */}
          <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
          <div className="flex gap-4">
            <MobileSearch />
            <ThemeToggle />
          </div>
          {/* TODO */}
          <div className="hidden min-[416px]:contents">
            {/* <Button href="/sign-in">{t('sign_in_link')}</Button> */}
            <Button href="/auth">Sign in</Button>
          </div>
        </div>
      </motion.div>
    )
  }
)
