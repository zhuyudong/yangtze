'use client'

import { Loading } from '@/components/Loading'
import { wrapper as Wrapper } from '@/components/mdx'
import { useContentList, useContentsRemoteState, useCurrentUser } from '@/hooks'

import { Content } from '../_components/Content'

export default function Excerpts() {
  const { data: contents = [], isLoading } = useContentList('photo')
  const { data: contentsState } = useContentsRemoteState()
  const { data: currentUser } = useCurrentUser()

  if (isLoading) return <Loading />
  return (
    <Wrapper>
      <h1>社会图文</h1>
      {contents.map((i, ix) => {
        return (
          <Content
            key={i.id}
            id={i.id}
            ix={ix}
            title={i.title}
            content={i.content}
            originHref={i.originHref}
            currentUser={currentUser}
            contentsState={contentsState}
          />
        )
      })}
    </Wrapper>
  )
}
