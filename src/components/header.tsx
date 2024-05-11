import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import type { CSSProperties, ElementRef, ReactNode } from 'react'
import { forwardRef } from 'react'

import { Button } from '@/components/button'
// import { MovieIcon } from '@/components/icons/movie-icon'
import { Logo } from '@/components/logo'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
  useMobileNavigationStore
} from '@/components/mobile-navigation'
import { MobileSearch, Search } from '@/components/search'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

import { LocaleSwitcher } from './locale-switcher'
import { UserMenu } from './user-menu'

// import { ArticleIcon } from './icons/ArticleIcon'

export function TopLevelNavItem({
  href,
  className,
  children
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  return (
    <li className={cn(className)}>
      <Link
        href={href}
        className="flex items-center space-x-2 text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

// export async function generateMetadata(props: { params: { locale: string } }) {
//   const t = await getTranslations({
//     locale: props.params?.locale,
//     namespace: 'RootLayout'
//   })

//   return {
//     title: t('sign_in_link')
//   }
// }

export const Header = forwardRef<ElementRef<'div'>, { className?: string }>(
  function Header({ className }, ref) {
    const tu = useTranslations('User')
    const tr = useTranslations('Resources')
    const { data: session } = useSession()
    const { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
    const isInsideMobileNavigation = useIsInsideMobileNavigation()

    const { scrollY } = useScroll()
    const bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
    const bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

    return (
      <motion.div
        ref={ref}
        className={cn(
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
          className={cn(
            'absolute inset-x-0 top-full h-px transition',
            (isInsideMobileNavigation || !mobileNavIsOpen) &&
              'bg-zinc-900/7.5 dark:bg-white/7.5'
          )}
        />
        <Search />
        <div className="flex items-center gap-1 lg:hidden">
          <MobileNavigation />
          <Link href="/" aria-label="Home">
            <Logo />
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <nav className="hidden md:block">
            <ul role="list" className="flex items-center gap-8">
              {/* <TopLevelNavItem href="/blog">Blog</TopLevelNavItem> */}
              <TopLevelNavItem href="/blog">{tr('blog')}</TopLevelNavItem>
              <TopLevelNavItem href="/essay">{tr('essay')}</TopLevelNavItem>
              <TopLevelNavItem href="/poetry">{tr('poetry')}</TopLevelNavItem>
              <TopLevelNavItem href="/movies">{tr('movies')}</TopLevelNavItem>
              <TopLevelNavItem href="/wallpaper">
                {tr('wallpaper')}
              </TopLevelNavItem>
            </ul>
          </nav>
          <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
          <div className="flex items-center gap-4">
            <MobileSearch />
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
          <div className="hidden min-[375px]:contents">
            {session ? (
              <UserMenu />
            ) : (
              <Button href="/auth">{tu('sign_in')}</Button>
            )}
          </div>
        </div>
      </motion.div>
    )
  }
)
