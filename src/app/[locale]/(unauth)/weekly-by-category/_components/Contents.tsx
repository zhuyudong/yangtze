'use client'

import { useCallback, useMemo, useState } from 'react'

// import { Loading } from '@/components/Loading'
import { wrapper as Wrapper } from '@/components/mdx'
import { useContentList, useContentsRemoteState, useCurrentUser } from '@/hooks'

import { Content } from './Content'
import { Pagination } from './Pagination'

type Title =
  | '文章'
  | '文摘'
  | '科技新闻'
  | '社会图文'
  | '言论'
  | '开发和学习资源'
  | '科技动态'
  | '开发工具'

type Category =
  | 'article'
  | 'photo'
  | 'new'
  | 'excerpt'
  | 'resource'
  | 'quotation'
  | 'technology-new'
  | 'tool'

export default function Contents(props: { title: Title; category: Category }) {
  const { data, run } = useContentList({ category: props.category })
  const { data: contentsState } = useContentsRemoteState()
  const { data: currentUser } = useCurrentUser()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(20)

  const res = useMemo(() => {
    return {
      data: data?.data.data || [],
      total: data?.data.total || 0,
      prev: data?.data.prev,
      next: data?.data.next
    }
  }, [data?.data.data, pageNumber, pageSize])

  // console.log(data)

  const handlePagination = useCallback((page_number: number) => {
    setPageNumber(page_number)
    run({ category: 'article', page_number, page_size: 20 })
  }, [])

  // if (isLoading) return <Loading />

  return (
    <Wrapper>
      <h1>{props.title}</h1>
      {res.data.map((i, ix) => {
        return (
          <Content
            key={i.id}
            id={i.id}
            ix={(pageNumber - 1) * pageSize + ix}
            title={i.title}
            content={i.content}
            originHref={i.originHref}
            currentUser={currentUser}
            contentsState={contentsState}
          />
        )
      })}
      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        total={res.total}
        onClick={handlePagination}
      />
    </Wrapper>
  )
}
