'use client'

import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useRef } from 'react'

import { Button } from '@/components/button'
import { useIsInsideMobileNavigation } from '@/components/mobile-navigation'
import { useSectionStore } from '@/components/section-provider'
import { Tag } from '@/components/tag'
import { type NavGroup, navigationOfEn, navigationOfZh } from '@/lib/navigation'
import { remToPx } from '@/lib/rem-to-px'
import { cn } from '@/lib/utils'

import { UserMenu } from './user-menu'

function useInitialValue<T>(value: T, condition = true) {
  const initialValue = useRef(value).current
  return condition ? initialValue : value
}

function TopLevelNavItem({
  href,
  children
}: {
  href: string
  children: ReactNode
}) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

function NavLink({
  href,
  children,
  tag,
  className,
  active = false,
  isAnchorLink = false
}: {
  href: string
  children: ReactNode
  tag?: string
  active?: boolean
  className?: string
  isAnchorLink?: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
        className
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  )
}

function VisibleSectionHighlight({
  group,
  pathname
}: {
  group: NavGroup
  pathname: string
}) {
  const [sections, visibleSections] = useInitialValue(
    [useSectionStore(s => s.sections), useSectionStore(s => s.visibleSections)],
    useIsInsideMobileNavigation()
  )

  const isPresent = useIsPresent()
  const firstVisibleSectionIndex = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      section => section.id === visibleSections[0]
    )
  )
  const itemHeight = remToPx(2)
  const height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight
  const top =
    group.links.findIndex(link => link.href === pathname) * itemHeight +
    firstVisibleSectionIndex * itemHeight

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

function ActivePageMarker({
  group,
  pathname
}: {
  group: NavGroup
  pathname: string
}) {
  const itemHeight = remToPx(2)
  const offset = remToPx(0.25)
  const activePageIndex = group.links.findIndex(link => link.href === pathname)
  const top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-emerald-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NavigationGroup({
  group,
  className
}: {
  group: NavGroup
  className?: string
}) {
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  const isInsideMobileNavigation = useIsInsideMobileNavigation()
  const [pathname, sections] = useInitialValue(
    [usePathname(), useSectionStore(s => s.sections)],
    isInsideMobileNavigation
  )

  const isActiveGroup =
    group.links.findIndex(link => link.href === pathname) !== -1

  return (
    <li className={cn('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map(link => (
            <motion.li key={link.href} layout="position" className="relative">
              <div className="flex items-center">
                {link.icon && <link.icon className="ml-1 size-5" />}
                <NavLink
                  href={link.href}
                  className={link.icon ? '-ml-2' : ''}
                  active={link.href === pathname}
                >
                  {link.title}
                </NavLink>
              </div>
              <AnimatePresence mode="popLayout" initial={false}>
                {link.href === pathname && sections.length > 0 && (
                  <motion.ul
                    role="list"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.1 }
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 }
                    }}
                  >
                    {sections.map(section => (
                      <li key={section.id}>
                        <NavLink
                          href={`${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                        >
                          {section.title}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export function Navigation(props: ComponentPropsWithoutRef<'nav'>) {
  const locale = useLocale()
  const navigation = locale === 'en' ? navigationOfEn : navigationOfZh
  const tr = useTranslations('Resources')
  const tu = useTranslations('User')
  const { data: session } = useSession()

  return (
    <nav {...props}>
      <ul role="list">
        {/* <TopLevelNavItem href="/blog">Blog</TopLevelNavItem> */}
        <TopLevelNavItem href="/blog">{tr('blog')}</TopLevelNavItem>
        <TopLevelNavItem href="/essay">{tr('essay')}</TopLevelNavItem>
        <TopLevelNavItem href="/poetry">{tr('poetry')}</TopLevelNavItem>
        <TopLevelNavItem href="/movies">{tr('movies')}</TopLevelNavItem>
        <TopLevelNavItem href="/wallpaper">{tr('wallpaper')}</TopLevelNavItem>
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 ? 'md:mt-0' : ''}
          />
        ))}
        <li className="sticky bottom-0 z-10 mt-6 min-[375px]:hidden">
          {session ? (
            <UserMenu />
          ) : (
            <Button href="/sign-in" variant="filled" className="w-full">
              {tu('sign_in')}
            </Button>
          )}
        </li>
      </ul>
    </nav>
  )
}
