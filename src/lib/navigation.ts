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
    title: '概览',
    links: [
      { title: 'Introduction', href: '/' },
      { title: 'Node.js', href: '/nodejs' },
      { title: 'Package Manager', href: '/package-manager' },
      { title: 'Git 配置', href: '/git-config' },
      { title: 'Git 工具', href: '/git-tools' },
      { title: 'Git 案例', href: '/git-examples' },
      { title: 'Remix', href: '/remix' },
      { title: 'Next.js', href: '/nextjs' },
      { title: 'React APIs', href: '/react-apis' },
      { title: 'TailwindCSS', href: '/tailwindcss' },
      { title: 'package.json', href: '/package' },
      { title: 'VSCode 实践指南', href: '/vscode' },
      { title: 'shadcn/ui', href: '/shadcn-ui' },
      { title: '@tanstack/react-table', href: '/tanstack__react-table' },
      { title: '@tanstack/react-query', href: '/tanstack__react-query' },
      { title: 'FastAPI', href: '/python-fastapi' },
      { title: 'Python Snippets', href: '/python' },
      { title: 'Python 环境管理', href: '/python-environment' },
      { title: 'Python 代码检查与格式化', href: '/python-lint' },
      { title: 'Linux', href: '/awesome-linux' },
      { title: 'Redis', href: '/redis' },
      { title: 'MongoDB 常用语句', href: '/mongo' },
      { title: 'Artificial Intelligence Generated', href: '/aigc' }
    ]
  },
  {
    title: '资源',
    links: [
      { title: '诗词', href: '/poetry', icon: FireIcon },
      // { title: '壁纸', href: '/wallpaper', icon: MapPinIcon },
      // { title: '电影', href: '/movies', icon: MovieIcon },
      {
        title: '文章',
        href: '/weekly-by-category/articles',
        icon: ArticleIcon
      },
      {
        title: '文摘',
        href: '/weekly-by-category/excerpts',
        icon: ExcerptIcon
      },
      {
        title: '言论',
        href: '/weekly-by-category/quotations',
        icon: QuotationIcon
      },
      {
        title: '社会图文',
        href: '/weekly-by-category/photos',
        icon: PhotoIcon
      },
      { title: '科技新闻', href: '/weekly-by-category/news', icon: NewIcon },
      { title: '开发工具', href: '/weekly-by-category/tools', icon: ToolIcon },
      {
        title: '科技动态',
        href: '/weekly-by-category/technology-news',
        icon: TechnologyNewIcon
      },
      {
        title: '开发与学习资源',
        href: '/weekly-by-category/resources',
        icon: ResourceIcon
      }
    ]
  }
]
