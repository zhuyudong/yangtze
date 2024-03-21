export interface NavGroup {
  title: string
  links: Array<{
    title: string
    href: string
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
      { title: 'package.json', href: '/package' },
      { title: 'VSCode 实践指南', href: '/vscode' },
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
      { title: 'Linux', href: '/awesome-linux' },
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
