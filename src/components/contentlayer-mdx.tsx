import { useMDXComponent } from 'next-contentlayer/hooks'

import { useConfig } from '@/hooks'

import { h2, pre } from './contentlayer-components' // code as ocode,
import { components } from './mdx-components'

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  components.h2 = h2
  components.pre = pre
  // TODO
  // components.code = ocode
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
