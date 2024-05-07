'use client'

import { Mdx } from '@/components/mdx-component'

const MdxContent = ({ code }: { code: string }) => {
  return (
    <div>
      <Mdx code={code} />
    </div>
  )
}

export default MdxContent
