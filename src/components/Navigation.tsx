/* eslint-disable unused-imports/no-unused-vars */

'use client'

import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useRef } from 'react'

import { Button } from '@/components/Button'
import { ArticleIcon } from '@/components/icons/ArticleIcon'
import { ExcerptIcon } from '@/components/icons/ExcerptIcon'
import { FireIcon } from '@/components/icons/FireIcon'
import { NewIcon } from '@/components/icons/NewIcon'
import { PhotoIcon } from '@/components/icons/PhotoIcon'
import { QuotationIcon } from '@/components/icons/QuotationIcon'
import { ResourceIcon } from '@/components/icons/ResourceIcon'
import { TechnologyNewIcon } from '@/components/icons/TechnologyNewIcon'
import { ToolIcon } from '@/components/icons/ToolIcon'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from '@/components/SectionProvider'
import { Tag } from '@/components/Tag'
import type { NavGroup } from '@/lib/navigation'
import { remToPx } from '@/lib/remToPx'
import { cn } from '@/lib/utils'

import { CPUChipIcon } from './icons/CPUChipIcon'
import { MapPinIcon } from './icons/MapPinIcon'
import { MovieIcon } from './icons/MovieIcon'
import { UserMenu } from './UserMenu'

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
  const tr = useTranslations('Resources')
  const tu = useTranslations('User')
  const { data: session } = useSession()

  const ns: Array<NavGroup> = [
    {
      title: tr('technology_column'),
      links: [
        { title: 'Introduction', href: '/' },
        { title: 'React APIs', href: '/react-apis' },
        { title: 'Git practice', href: '/git-config' },
        { title: 'Node.js tutorial', href: '/nodejs' },
        // { title: 'Git 工具', href: '/git-tools' },
        // { title: 'Git 案例', href: '/git-examples' },
        { title: 'Remix practice', href: '/remix' },
        { title: 'Next.js tutorial', href: '/nextjs' },
        { title: 'VSCode practice', href: '/vscode' },
        { title: 'TailwindCSS practice', href: '/tailwindcss' },
        { title: 'package.json tutorial', href: '/package' },
        { title: 'Frontend components', href: '/frontend-components' },
        {
          title: 'Frontend dependencies',
          href: '/package-manager'
        },
        { title: '@tanstack/react-table', href: '/tanstack__react-table' },
        { title: '@tanstack/react-query', href: '/tanstack__react-query' },
        { title: 'Linux tutorial', href: '/awesome-linux' },
        { title: 'FastAPI practice', href: '/python-fastapi' },
        { title: 'Python snippets', href: '/python' },
        { title: 'Python environment', href: '/python-environment' },
        { title: 'Python Lint & Formatting', href: '/python-lint' },
        { title: 'Redis tutorial', href: '/redis' },
        { title: 'MongoDB tutorial', href: '/mongo' },
        { title: 'PostgreSQL tutorial', href: '/postgres' },
        { title: 'Artificial Intelligence Generated', href: '/aigc' }
      ]
    },
    {
      title: tr('reading_space'),
      links: [
        { title: tr('blog'), href: '/blog', icon: ArticleIcon },
        { title: tr('essay'), href: '/essay', icon: CPUChipIcon },
        { title: tr('poetry'), href: '/poetry', icon: FireIcon },
        { title: tr('wallpaper'), href: '/wallpaper', icon: MapPinIcon },
        { title: tr('movies'), href: '/movies', icon: MovieIcon },
        {
          title: tr('articles'),
          href: '/weekly-by-category/articles',
          icon: ArticleIcon
        },
        {
          title: tr('excerpts'),
          href: '/weekly-by-category/excerpts',
          icon: ExcerptIcon
        },
        {
          title: tr('quotations'),
          href: '/weekly-by-category/quotations',
          icon: QuotationIcon
        },
        {
          title: tr('social_photos_text'),
          href: '/weekly-by-category/photos',
          icon: PhotoIcon
        },
        {
          title: tr('technology_news'),
          href: '/weekly-by-category/news',
          icon: NewIcon
        },
        {
          title: tr('technology_trends'),
          href: '/weekly-by-category/technology-news',
          icon: TechnologyNewIcon
        },
        {
          title: tr('development_tools'),
          href: '/weekly-by-category/tools',
          icon: ToolIcon
        },
        {
          title: tr('resources'),
          href: '/weekly-by-category/resources',
          icon: ResourceIcon
        }
      ]
    }
  ]
  return (
    <nav {...props}>
      <ul role="list">
        {/* <TopLevelNavItem href="/blog">Blog</TopLevelNavItem> */}
        <TopLevelNavItem href="/blog">{tr('blog')}</TopLevelNavItem>
        <TopLevelNavItem href="/essay">{tr('essay')}</TopLevelNavItem>
        <TopLevelNavItem href="/poetry">{tr('poetry')}</TopLevelNavItem>
        <TopLevelNavItem href="/movies">{tr('movies')}</TopLevelNavItem>
        <TopLevelNavItem href="/wallpaper">{tr('wallpaper')}</TopLevelNavItem>
        {ns.map((group, groupIndex) => (
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
