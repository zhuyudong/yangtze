import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const guides: { href: string; name: string; description: string }[] = [
  {
    href: '/react-apis',
    name: '前端',
    description: 'React 实战'
  },
  {
    href: '/python-environment',
    name: 'Python',
    description: '关于 Python 的一切'
  },
  {
    href: '/awesome-linux',
    name: '服务器',
    description: 'Linux 常用命令与工具'
  },
  {
    href: '/mongo',
    name: '数据库',
    description: '数据库常见问题'
  },
  {
    href: '/aigc',
    name: 'AIG',
    description: 'AIG 就是未来'
  }
]

export function Guides() {
  return (
    // remove xl:max-w-none
    <div className="my-16">
      <Heading level={2} id="guides">
        概览
      </Heading>
      {/* NOTE: xl:grid-cols-5 一行 5 列  */}
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-5">
        {guides.map(guide => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                阅读更多
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
