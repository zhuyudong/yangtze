'use client'

import { Mdx } from '@/components/contentlayer-mdx'

const MdxContent = ({ code }: { code: string }) => {
  return (
    <div>
      <Mdx code={code} />
    </div>
  )
}

export default MdxContent
