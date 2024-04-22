'use client'

import { Loading } from '@/components/Loading'
import { wrapper as Wrapper } from '@/components/mdx'
import { useContentList, useNoInterested } from '@/hooks'

import { Content } from '../_components/Content'
import InterestedLine from '../_components/InterestedLine'

export default function Excerpts() {
  const { isNoInterested } = useNoInterested()
  const { data: contents = [], isLoading } = useContentList('resource')

  if (isLoading) return <Loading />
  return (
    <Wrapper>
      <h1>开发和学习资源</h1>
      {contents.map((i, ix) => {
        if (isNoInterested[i.id]) {
          return <InterestedLine key={i.id} id={i.id} />
        }
        return (
          <Content
            key={i.id}
            id={i.id}
            ix={ix}
            title={i.title}
            content={i.content}
            originHref={i.originHref}
          />
        )
      })}
    </Wrapper>
  )
}
