import { useMDXComponent } from 'next-contentlayer/hooks'

import { useConfig } from '@/hooks/use-config'

import { components } from './mdx-components'

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  const [config] = useConfig()
  const Component = useMDXComponent(code, {
    style: config.style
  })

  return (
    <div className="mdx">
      {/* @ts-expect-error types are not ideal here but it works  */}
      <Component components={components} />
    </div>
  )
}
