'use client'

import { Mdx } from '@/components/patterns/mdx'

const MdxContent = ({ code }: { code: string }) => {
  return (
    <div>
      <Mdx code={code} />
    </div>
  )
}

export default MdxContent
