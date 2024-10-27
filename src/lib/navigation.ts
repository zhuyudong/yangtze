// import { MapPinIcon } from '@heroicons/react/24/outline'
import type { ComponentType } from 'react'

import { ArticleIcon } from '@/components/icons/article-icon'
import { CPUChipIcon } from '@/components/icons/cpu-chip-icon'
import { ExcerptIcon } from '@/components/icons/excerpt-icon'
import { FireIcon } from '@/components/icons/fire-icon'
import { MapPinIcon } from '@/components/icons/map-pin-icon'
import { MovieIcon } from '@/components/icons/movie-icon'
import { NewIcon } from '@/components/icons/new-icon'
import { PhotoIcon } from '@/components/icons/photo-icon'
import { QuotationIcon } from '@/components/icons/quotation-icon'
import { ResourceIcon } from '@/components/icons/resource-icon'
import { TechnologyNewIcon } from '@/components/icons/technology-new-icon'
import { ToolIcon } from '@/components/icons/tool-icon'

export interface NavGroup {
  title: string
  links: {
    title: string
    href: string
    icon?: ComponentType<{ className?: string }>
  }[]
}

export const navigationOfZh: NavGroup[] = [
  {
    title: '技术专栏',
    links: [
      { title: '总览', href: '/' },
      { title: 'React APIs', href: '/react-apis' },
      { title: 'Git 使用', href: '/git-config' },
      { title: 'Node.js 实践', href: '/nodejs' },
      { title: 'Remix 实践', href: '/remix' },
      { title: 'Next.js 实践', href: '/nextjs' },
      { title: 'VSCode 实践', href: '/vscode' },
      { title: 'TailwindCSS 实践', href: '/tailwindcss' },
      { title: 'package.json 总结', href: '/package' },
      { title: 'React 组件库', href: '/frontend-components' },
      {
        title: '前端常用依赖',
        href: '/package-manager'
      },
      { title: '@tanstack/react-table', href: '/tanstack__react-table' },
      { title: '@tanstack/react-query', href: '/tanstack__react-query' },
      { title: 'Linux 脚本与工具', href: '/awesome-linux' },
      { title: 'FastAPI 实战', href: '/python-fastapi' },
      { title: 'Python 代码片段', href: '/python' },
      { title: 'Python 环境管理', href: '/python-environment' },
      { title: 'Python 语法检查与格式化', href: '/python-lint' },
      { title: '《Python Cookbook》', href: '/python-cookbook' },
      { title: '《Python Fluent》', href: '/python-fluent' },
      { title: 'Redis 总结', href: '/redis' },
      { title: 'MongoDB 总结', href: '/mongo' },
      { title: 'PostgreSQL 总结', href: '/postgres' },
      { title: 'AIGC', href: '/aigc' }
    ]
  },
  {
    title: '阅读空间',
    links: [
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
      { title: '技术资讯', href: '/weekly-by-category/news', icon: NewIcon },
      {
        title: '科技动态',
        href: '/weekly-by-category/technology-news',
        icon: TechnologyNewIcon
      },
      { title: '开发工具', href: '/weekly-by-category/tools', icon: ToolIcon },
      {
        title: '技术资源',
        href: '/weekly-by-category/resources',
        icon: ResourceIcon
      }
    ]
  },
  {
    title: '个人天地',
    links: [
      { title: '博客【原创】', href: '/blog', icon: ArticleIcon },
      { title: '随笔', href: '/essay', icon: CPUChipIcon }
    ]
  },
  {
    title: '休闲驿站',
    links: [
      { title: '诗词', href: '/poetry', icon: FireIcon },
      { title: '壁纸', href: '/wallpaper', icon: MapPinIcon },
      { title: '电影', href: '/movies', icon: MovieIcon }
    ]
  }
]

export const navigationOfEn: NavGroup[] = [
  {
    title: 'Technology column',
    links: [
      { title: 'Overview', href: '/' },
      { title: 'React APIs', href: '/react-apis' },
      { title: 'Git practice', href: '/git-config' },
      { title: 'Node.js usage', href: '/nodejs' },
      { title: 'Remix practice', href: '/remix' },
      { title: 'Next.js practice', href: '/nextjs' },
      { title: 'VSCode practice', href: '/vscode' },
      { title: 'TailwindCSS practice', href: '/tailwindcss' },
      { title: 'package.json summary', href: '/package' },
      { title: 'Frontend components', href: '/frontend-components' },
      {
        title: 'Frontend dependencies',
        href: '/package-manager'
      },
      { title: '@tanstack/react-table', href: '/tanstack__react-table' },
      { title: '@tanstack/react-query', href: '/tanstack__react-query' },
      { title: 'Linux scripts & tools', href: '/awesome-linux' },
      { title: 'FastAPI practice', href: '/python-fastapi' },
      { title: 'Python snippets', href: '/python' },
      { title: 'Python environment', href: '/python-environment' },
      { title: 'Python Lint & Formatting', href: '/python-lint' },
      { title: '《Python Cookbook》', href: '/python-cookbook' },
      { title: '《Python Fluent》', href: '/python-fluent' },
      { title: 'Redis tutorial', href: '/redis' },
      { title: 'MongoDB tutorial', href: '/mongo' },
      { title: 'PostgreSQL tutorial', href: '/postgres' },
      { title: 'Artificial Intelligence Generated', href: '/aigc' }
    ]
  },
  {
    title: 'Reading space',
    links: [
      {
        title: 'Articles',
        href: '/weekly-by-category/articles',
        icon: ArticleIcon
      },
      {
        title: 'Excerpts',
        href: '/weekly-by-category/excerpts',
        icon: ExcerptIcon
      },
      {
        title: 'Quotations',
        href: '/weekly-by-category/quotations',
        icon: QuotationIcon
      },
      {
        title: 'Social photos text',
        href: '/weekly-by-category/photos',
        icon: PhotoIcon
      },
      {
        title: 'Technology news',
        href: '/weekly-by-category/news',
        icon: NewIcon
      },
      {
        title: 'Development tools',
        href: '/weekly-by-category/tools',
        icon: ToolIcon
      },
      {
        title: 'Technology trends',
        href: '/weekly-by-category/technology-news',
        icon: TechnologyNewIcon
      },
      {
        title: 'Development resources',
        href: '/weekly-by-category/resources',
        icon: ResourceIcon
      }
    ]
  },
  {
    title: 'Personal world',
    links: [
      { title: 'Blog[original]', href: '/blog', icon: ArticleIcon },
      { title: 'Essay', href: '/essay', icon: CPUChipIcon }
    ]
  },
  {
    title: 'Leisure station',
    links: [
      { title: 'Poetry', href: '/poetry', icon: FireIcon },
      { title: 'Wallpaper', href: '/wallpaper', icon: MapPinIcon },
      { title: 'Movies', href: '/movies', icon: MovieIcon }
    ]
  }
]
