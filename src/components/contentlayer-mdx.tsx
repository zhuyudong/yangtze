import '@/styles/mdx.css'

import { useMDXComponent } from 'next-contentlayer/hooks'

import { useConfig } from '@/hooks'

import { code as ocode, h2, pre } from './contentlayer-components'
import { components } from './mdx-components'

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  components.h2 = h2
  components.pre = pre
  components.code = ocode
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
