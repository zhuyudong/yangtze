// import { MapPinIcon } from '@heroicons/react/24/outline'
import type { ComponentType } from 'react'

import { ArticleIcon } from '@/components/icons/ArticleIcon'
import { ExcerptIcon } from '@/components/icons/ExcerptIcon'
import { FireIcon } from '@/components/icons/FireIcon'
import { NewIcon } from '@/components/icons/NewIcon'
import { PhotoIcon } from '@/components/icons/PhotoIcon'
import { QuotationIcon } from '@/components/icons/QuotationIcon'
import { ResourceIcon } from '@/components/icons/ResourceIcon'
import { TechnologyNewIcon } from '@/components/icons/TechnologyNewIcon'
import { ToolIcon } from '@/components/icons/ToolIcon'

export interface NavGroup {
  title: string
  links: Array<{
    title: string
    href: string
    icon?: ComponentType<{ className?: string }>
  }>
}

export const navigation: Array<NavGroup> = [
  {
    title: 'technology_column',
    links: [
      { title: 'Overview', href: '/' },
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
    title: 'reading_space',
    links: [
      { title: 'poetry', href: '/poetry', icon: FireIcon },
      // { title: '壁纸', href: '/wallpaper', icon: MapPinIcon },
      // { title: '电影', href: '/movies', icon: MovieIcon },
      {
        title: 'articles',
        href: '/weekly-by-category/articles',
        icon: ArticleIcon
      },
      {
        title: 'excerpts',
        href: '/weekly-by-category/excerpts',
        icon: ExcerptIcon
      },
      {
        title: 'quotations',
        href: '/weekly-by-category/quotations',
        icon: QuotationIcon
      },
      {
        title: 'photos',
        href: '/weekly-by-category/photos',
        icon: PhotoIcon
      },
      { title: 'news', href: '/weekly-by-category/news', icon: NewIcon },
      { title: 'tools', href: '/weekly-by-category/tools', icon: ToolIcon },
      {
        title: 'technology_trends',
        href: '/weekly-by-category/technology-news',
        icon: TechnologyNewIcon
      },
      {
        title: 'resources',
        href: '/weekly-by-category/resources',
        icon: ResourceIcon
      }
    ]
  }
]
