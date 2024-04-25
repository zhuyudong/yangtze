'use client'

import { useCallback, useMemo, useState } from 'react'

// import { Loading } from '@/components/Loading'
import { wrapper as Wrapper } from '@/components/mdx'
import type { WeeklyCategory } from '@/hooks'
import {
  useContentList,
  useContentsRemoteState,
  useCurrentUser,
  usePagination
} from '@/hooks'

import { Buttons } from './Buttons'
import { Content } from './Content'
import { Pagination } from './Pagination'
import SwitchOpen from './Switch'

type Title =
  | '文章'
  | '文摘'
  | '科技新闻'
  | '社会图文'
  | '言论'
  | '开发和学习资源'
  | '科技动态'
  | '开发工具'

export default function Contents(props: {
  title: Title
  category: WeeklyCategory
}) {
  const { data, run } = useContentList({ category: props.category })
  const { data: contentsState } = useContentsRemoteState()
  const { data: currentUser } = useCurrentUser()
  const { pageSize, pageNumber, setPageSize, setPageNumber } = usePagination()
  const [favoritedEnabled, setFavoritedEnabled] = useState(false)
  const [likedEnabled, setLikedEnabled] = useState(false)
  const [hiddenNoInterestedEnabled, setHiddenNoInterestedEnabled] =
    useState(false)

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
    setPageNumber(props.category, page_number)
    run({ category: 'article', page_number, page_size: 20 })
  }, [])

  const handlePageSize = useCallback(
    (page_size: number | string) => {
      setPageSize(props.category, page_size as number)
      run({
        category: 'article',
        page_number: 1,
        page_size: page_size as number
      })
    },
    [
      props.category,
      run,
      setPageSize,
      pageNumber[props.category],
      pageSize[props.category]
    ]
  )

  const handleOnlyFavorited = useCallback(() => {
    setFavoritedEnabled(!favoritedEnabled)
  }, [favoritedEnabled])

  const handleOnlyLiked = useCallback(() => {
    setLikedEnabled(!likedEnabled)
  }, [likedEnabled])

  const handleHiddenNoInterested = useCallback(() => {
    setHiddenNoInterestedEnabled(!hiddenNoInterestedEnabled)
  }, [hiddenNoInterestedEnabled])

  // if (isLoading) return <Loading />

  return (
    <Wrapper>
      <h1>{props.title}</h1>
      <div className="mb-3 space-x-3">
        <span className="mb-1 inline-block text-sm text-gray-700">
          items/page:
        </span>
        <Buttons
          items={[20, 40, 60]}
          current={pageSize[props.category]}
          onClick={handlePageSize}
        />
      </div>
      <div className="flex space-x-4">
        <SwitchOpen
          text="Favorited"
          enabled={favoritedEnabled}
          setEnabled={handleOnlyFavorited}
        />
        <SwitchOpen
          text="Liked"
          enabled={likedEnabled}
          setEnabled={handleOnlyLiked}
        />
        <SwitchOpen
          text="Nointerested"
          enabled={hiddenNoInterestedEnabled}
          setEnabled={handleHiddenNoInterested}
        />
      </div>
      {res.data.map((i, ix) => {
        return (
          <Content
            key={i.id}
            id={i.id}
            ix={
              (pageNumber[props.category] - 1) * pageSize[props.category] + ix
            }
            title={i.title}
            content={i.content}
            originHref={i.originHref}
            currentUser={currentUser}
            contentsState={contentsState}
          />
        )
      })}
      <Pagination
        pageNumber={pageNumber[props.category]}
        pageSize={pageSize[props.category]}
        total={res.total}
        onClick={handlePagination}
      />
    </Wrapper>
  )
}
