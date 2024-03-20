'use client'

import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion' // useIsPresent
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useRef } from 'react'

import { Button } from '@/components/Button'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from '@/components/SectionProvider'
import { Tag } from '@/components/Tag'
// import { remToPx } from '@/libs/remToPx'

interface NavGroup {
  title: string
  links: Array<{
    title: string
    href: string
  }>
}

function useInitialValue<T>(value: T, condition = true) {
  const initialValue = useRef(value).current
  return condition ? initialValue : value
}

export function TopLevelNavItem({
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
  active = false,
  isAnchorLink = false
}: {
  href: string
  children: ReactNode
  tag?: string
  active?: boolean
  isAnchorLink?: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
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
  // eslint-disable-next-line unused-imports/no-unused-vars
  group,
  // eslint-disable-next-line unused-imports/no-unused-vars
  pathname
}: {
  group: NavGroup
  pathname: string
}) {
  // const [sections, visibleSections] = useInitialValue(
  //   [useSectionStore(s => s.sections), useSectionStore(s => s.visibleSections)],
  //   useIsInsideMobileNavigation()
  // )

  // const isPresent = useIsPresent()
  // const firstVisibleSectionIndex = Math.max(
  //   0,
  //   [{ id: '_top' }, ...sections].findIndex(
  //     section => section.id === visibleSections[0]
  //   )
  // )
  // const itemHeight = remToPx(2)
  // const height = isPresent
  //   ? Math.max(1, visibleSections.length) * itemHeight
  //   : itemHeight
  // const top =
  //   group.links.findIndex(link => link.href === pathname) * itemHeight +
  //   firstVisibleSectionIndex * itemHeight

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      // FIXME: Warning: Prop `style` did not match. Server: "border-radius:8px;height:32px;top:0;opacity:0" Client: "border-radius:8px;height:24px;top:0;opacity:0"
      // style={{ borderRadius: 8, height, top }}
      style={{ borderRadius: 8, height: 24, top: 0 }}
    />
  )
}

function ActivePageMarker({
  // eslint-disable-next-line unused-imports/no-unused-vars
  group,
  // eslint-disable-next-line unused-imports/no-unused-vars
  pathname
}: {
  group: NavGroup
  pathname: string
}) {
  // const itemHeight = remToPx(2)
  // const offset = remToPx(0.25)
  // const activePageIndex = group.links.findIndex(link => link.href === pathname)
  // const top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-emerald-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      // FIXME: Warning: Prop `style` did not match. Server: "top:4px;opacity:1" Client: "top:3px;opacity:1"
      // style={{ top }}
      style={{ top: 3 }}
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
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight
              group={group}
              pathname={pathname as string}
            />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={pathname as string} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map(link => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} active={link.href === pathname}>
                {link.title}
              </NavLink>
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

export const navigation: Array<NavGroup> = [
  {
    title: '概览',
    links: [
      { title: '介绍', href: '/' },
      { title: 'nvm', href: '/nvm' },
      { title: 'pnpm', href: '/pnpm' },
      { title: 'Git 配置', href: '/git-config' },
      { title: 'Git 工具', href: '/git-tools' },
      { title: 'Git 案例', href: '/git-examples' },
      { title: 'package.json', href: '/package' },
      { title: 'VSCode', href: '/vscode' },
      { title: 'Remix', href: '/remix' },
      { title: 'Next.js', href: '/nextjs' },
      { title: 'TailwindCSS', href: '/tailwindcss' },
      { title: 'React APIs', href: '/react-apis' },
      { title: '@tanstack/react-table', href: '/tanstack__react-table' },
      { title: '@tanstack/react-query', href: '/tanstack__react-query' },
      { title: 'Python Snippets', href: '/python' },
      { title: 'Python 环境管理', href: '/python-environment' },
      { title: 'FastAPI', href: '/python-fastapi' },
      { title: 'Python 代码检查与格式化', href: '/python-lint' },
      { title: 'Redis', href: '/redis' },
      { title: 'MongoDB 常用语句', href: '/mongo' },
      { title: 'AIGC', href: '/AIGC' }
    ]
  },
  {
    title: '资源',
    links: [
      { title: '诗词', href: '/poetry' },
      { title: '壁纸', href: '/wallpaper' }
    ]
  }
]

export function Navigation(props: ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav {...props}>
      <ul role="list">
        {/* <TopLevelNavItem href="/">API</TopLevelNavItem>
        <TopLevelNavItem href="#">Documentation</TopLevelNavItem>
        <TopLevelNavItem href="#">Support</TopLevelNavItem> */}
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 ? 'md:mt-0' : ''}
          />
        ))}
        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button href="/sign-in" variant="filled" className="w-full">
            登录
          </Button>
        </li>
      </ul>
    </nav>
  )
}
