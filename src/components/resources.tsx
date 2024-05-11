'use client'

import { MapPinIcon } from '@heroicons/react/24/outline'
import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue
} from 'framer-motion'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { type ComponentPropsWithoutRef, type ComponentType } from 'react'

import { GridPattern } from '@/components/grid-pattern'
import { Heading } from '@/components/heading'
// import { UserIcon } from '@/components/icons/UserIcon'
import { useRandomIndex } from '@/hooks'
import { cn } from '@/lib/utils'
import wallpapers from '@/resources/bing_wallpaper.json'
import movieQuotes from '@/resources/movie_quotes.json'
import poetry from '@/resources/poetry.json'

import { ArticleIcon } from './icons/article-icon'
import { BookIcon } from './icons/book-icon'
import { CPUChipIcon } from './icons/cpu-chip-icon'
import { ExcerptIcon } from './icons/excerpt-icon'
import { MovieIcon } from './icons/movie-icon'
import { NewIcon } from './icons/new-icon'
import { PhotoIcon } from './icons/photo-icon'
import { QuotationIcon } from './icons/quotation-icon'
import { ResourceIcon as ResourcesIcon } from './icons/resource-icon'
import { TechnologyNewIcon } from './icons/technology-new-icon'
import { ToolIcon } from './icons/tool-icon'

interface IResource {
  href: string
  name: string
  bg?: string
  description: string
  icon: ComponentType<{ className?: string }>
  pattern: Omit<
    ComponentPropsWithoutRef<typeof GridPattern>,
    'width' | 'height' | 'x'
  >
}

function ResourceIcon({ icon: Icon }: { icon: IResource['icon'] }) {
  return (
    <div className="flex size-7 items-center justify-center rounded-full bg-zinc-900/5 ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:bg-white/7.5 dark:ring-white/15 dark:group-hover:bg-emerald-300/10 dark:group-hover:ring-emerald-400">
      <Icon className="size-5 fill-zinc-700/10 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-emerald-300/10 dark:group-hover:stroke-emerald-400" />
    </div>
  )
}

function ResourcePattern({
  mouseX,
  mouseY,
  ...gridProps
}: IResource['pattern'] & {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  const maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`
  const style = { maskImage, WebkitMaskImage: maskImage }

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5 dark:fill-white/1 dark:stroke-white/2.5"
          {...gridProps}
        />
      </div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D7EDEA] to-[#F4FBDF] opacity-0 transition duration-300 group-hover:opacity-100 dark:from-[#202D2E] dark:to-[#303428]"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
        style={style}
      >
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/50 stroke-black/70 dark:fill-white/2.5 dark:stroke-white/10"
          {...gridProps}
        />
      </motion.div>
    </div>
  )
}

function Resource({ resource }: { resource: IResource }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function onMouseMove({
    currentTarget,
    clientX,
    clientY
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      key={resource.href}
      onMouseMove={onMouseMove}
      className={cn(
        'group relative flex rounded-2xl transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5',
        resource.bg
      )}
    >
      <ResourcePattern {...resource.pattern} mouseX={mouseX} mouseY={mouseY} />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5 group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20" />
      <div className="relative rounded-2xl px-4 pb-4 pt-16">
        <ResourceIcon icon={resource.icon} />
        <h3 className="mt-4 text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
          <Link href={resource.href}>
            <span className="absolute inset-0 rounded-2xl" />
            {resource.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {resource.description}
        </p>
      </div>
    </div>
  )
}

function Station({ resource }: { resource: IResource }) {
  const { randomWallpaperIndex } = useRandomIndex()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function onMouseMove({
    currentTarget,
    clientX,
    clientY
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }
  return (
    <div
      key={resource.href}
      onMouseMove={onMouseMove}
      className="group relative flex h-40 rounded-xl bg-cyan-100 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5"
      style={
        resource.href === '/wallpaper'
          ? {
              backgroundImage: `url('${wallpapers[randomWallpaperIndex].url}')`,
              // objectFit: 'contain',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center right'
            }
          : {}
      }
    >
      <ResourcePattern {...resource.pattern} mouseX={mouseX} mouseY={mouseY} />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5 group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20" />
      <div className="relative rounded-2xl p-4">
        <div className="mb-2 flex items-end space-x-2">
          <ResourceIcon icon={resource.icon} />
          <h3 className="mt-4 text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
            <Link href={resource.href}>
              <span className="absolute inset-0 rounded-2xl" />
              {resource.name}
            </Link>
          </h3>
        </div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {resource.description}
        </p>
      </div>
    </div>
  )
}

export function Resources() {
  const t = useTranslations('Resources')
  const { randomMovieQuoteIndex, randomPoetryIndex } = useRandomIndex()

  const personal: Array<IResource> = [
    {
      href: '/blog',
      name: t('blog'),
      description: '',
      icon: ArticleIcon,
      bg: 'bg-zinc-50',
      pattern: {
        y: -6,
        squares: [
          [-1, 2],
          [1, 3]
        ]
      }
    },
    {
      href: '/essay',
      name: t('essay'),
      description: '',
      icon: CPUChipIcon,
      bg: 'bg-red-50',
      pattern: {
        y: 16,
        squares: [
          [0, 1],
          [1, 3]
        ]
      }
    }
  ]

  const resources: Array<IResource> = [
    {
      href: '/weekly-by-category/articles',
      name: t('articles'),
      description: '',
      icon: ArticleIcon,
      bg: 'bg-violet-50',
      pattern: {
        y: -6,
        squares: [
          [-1, 2],
          [1, 3]
        ]
      }
    },
    {
      href: '/weekly-by-category/excerpts',
      name: t('excerpts'),
      description: '',
      icon: ExcerptIcon,
      bg: 'bg-green-50',
      pattern: {
        y: -6,
        squares: [
          [-1, 2],
          [1, 3]
        ]
      }
    },
    {
      href: '/weekly-by-category/quotations',
      name: t('quotations'),
      description: '',
      icon: QuotationIcon,
      bg: 'bg-cyan-50',
      pattern: {
        y: -6,
        squares: [
          [-1, 2],
          [1, 3]
        ]
      }
    },
    {
      href: '/weekly-by-category/photos',
      name: t('social_photos_text'),
      description: '',
      icon: PhotoIcon,
      bg: 'bg-pink-50',
      pattern: {
        y: -6,
        squares: [
          [-1, 2],
          [1, 3]
        ]
      }
    },
    {
      href: '/weekly-by-category/news',
      name: t('technology_news'),
      description: '',
      icon: NewIcon,
      bg: 'bg-amber-50',
      pattern: {
        y: -6,
        squares: [
          [-1, 2],
          [1, 3]
        ]
      }
    },
    {
      href: '/weekly-by-category/tools',
      name: t('development_tools'),
      description: '',
      icon: ToolIcon,
      bg: 'bg-indigo-50',
      pattern: {
        y: -6,
        squares: [
          [-1, 2],
          [1, 3]
        ]
      }
    },
    {
      href: '/weekly-by-category/technology-news',
      name: t('technology_trends'),
      description: '',
      icon: TechnologyNewIcon,
      bg: 'bg-lime-50',
      pattern: {
        y: -6,
        squares: [
          [-1, 2],
          [1, 3]
        ]
      }
    },
    {
      href: '/weekly-by-category/resources',
      name: t('technology_resources'),
      description: '',
      icon: ResourcesIcon,
      bg: 'bg-emerald-50',
      pattern: {
        y: -6,
        squares: [
          [-1, 2],
          [1, 3]
        ]
      }
    }
  ]

  const leisureStation: Array<IResource> = [
    {
      href: '/wallpaper',
      name: t('wallpaper'),
      description: '大千世界、精彩纷呈',
      icon: MapPinIcon,
      pattern: {
        y: -6,
        squares: [
          [-1, 2],
          [1, 3]
        ]
      }
    },
    {
      href: '/poetry',
      name: t('poetry'),
      description: '',
      icon: BookIcon,
      pattern: {
        y: 32,
        squares: [
          [0, 2],
          [1, 4]
        ]
      }
    },
    {
      href: '/movies',
      name: t('movies'),
      description: '',
      icon: MovieIcon,
      pattern: {
        y: -6,
        squares: [
          [-1, 2],
          [1, 3]
        ]
      }
    }
  ]

  return (
    // remove xl:max-w-none
    <div className="my-16">
      <Heading level={2} id="resources">
        {t('reading_space')}
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {resources.map(resource => (
          <Resource key={resource.href} resource={resource} />
        ))}
      </div>
      <Heading level={2} id="resources">
        {t('personal_world')}
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {personal.map(i => (
          <Resource key={i.href} resource={i} />
        ))}
      </div>
      <Heading level={2} id="leisure-station">
        {t('leisure_station')}
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-1 xl:grid-cols-1">
        {leisureStation.map(i => {
          if (i.href === '/poetry') {
            // eslint-disable-next-line prefer-destructuring
            i.description = poetry[randomPoetryIndex]
          }
          if (i.name === '电影' || i.name === 'Movies') {
            i.description = movieQuotes[randomMovieQuoteIndex].match(
              /^\d+、\s?(.*)/
            )?.[1] as string // Math.floor(Math.random() * movieQuotes.length)
          }
          return <Station key={i.href} resource={i} />
        })}
      </div>
    </div>
  )
}
