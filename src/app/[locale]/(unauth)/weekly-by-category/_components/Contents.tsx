'use client'

import { useSession } from 'next-auth/react'
import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'

// import { Loading } from '@/components/Loading'
import { wrapper as Wrapper } from '@/components/mdx'
import type { WeeklyCategory } from '@/hooks'
import { useContents, useCurrentUser, usePagination } from '@/hooks'
import axios from '@/lib/axios'

import { Buttons } from './Buttons'
import { Content } from './Content'
import { Pagination } from './Pagination'
import SwitchOpen from './Switch'
import type { UpdatedContentsResponse } from './types'

type Title =
  | '文章'
  | '文摘'
  | '科技新闻'
  | '社会图文'
  | '言论'
  | '开发和学习资源'
  | '科技动态'
  | '开发工具'

export default function Contents({
  title,
  category
}: {
  title: Title
  category: WeeklyCategory
}) {
  const { data: session } = useSession()
  const { data, run, mutate: mutateContents } = useContents({ category })
  const { data: currentUser } = useCurrentUser()
  const {
    onlyFavorited,
    onlyLiked,
    hiddenNoInterested,
    setFilter,
    pageSize,
    pageNumber,
    setPageSize,
    setPageNumber
  } = usePagination()
  const { mutate: mutateCurrentUser } = useCurrentUser()

  const res = useMemo(() => {
    const d = {
      data: data?.data.data || [],
      total: data?.data.total || 0,
      prev: data?.data.prev,
      next: data?.data.next
    }
    if (onlyFavorited)
      d.data = d.data.filter(i => currentUser?.favoriteIds?.includes(i.id))
    if (onlyLiked)
      d.data = d.data.filter(i => currentUser?.likedIds?.includes(i.id))
    if (hiddenNoInterested)
      d.data = d.data.filter(i => !currentUser?.noInterestedIds?.includes(i.id))
    return d
  }, [
    data?.data.data,
    currentUser,
    onlyFavorited,
    onlyLiked,
    hiddenNoInterested
  ])

  // console.log(data)

  const handlePagination = useCallback((page_number: number) => {
    setPageNumber(category, page_number)
    run({
      category,
      page_number,
      page_size: pageSize[category]
    })
  }, [])

  const handlePageSize = useCallback(
    (page_size: number | string) => {
      setPageSize(category, page_size as number)
      run({
        category,
        page_number: 1,
        page_size: page_size as number
      })
    },
    [category, run, setPageSize, pageNumber[category], pageSize[category]]
  )

  const handleOnlyFavorited = useCallback(() => {
    setFilter('onlyFavorited', !onlyFavorited)
  }, [onlyFavorited])

  const handleOnlyLiked = useCallback(() => {
    setFilter('onlyLiked', !onlyLiked)
  }, [onlyLiked])

  const handleHiddenNoInterested = useCallback(() => {
    setFilter('hiddenNoInterested', !hiddenNoInterested)
  }, [hiddenNoInterested])

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!session) {
        toast.warning('Please sign in', {
          position: 'top-center'
        })
      }
      let response: UpdatedContentsResponse
      const isFavorite = currentUser?.favoriteIds?.includes(id)
      if (isFavorite) {
        response = await axios.delete('/api/contents/favorite', {
          data: { contentId: id }
        })
      } else {
        response = await axios.post(`/api/contents/favorite`, {
          contentId: id
        })
      }
      const updatedFavoriteIds = response?.data?.favoriteIds as string[]

      mutateCurrentUser({ ...currentUser!, favoriteIds: updatedFavoriteIds })
      mutateContents(_data => {
        _data!.data.data = _data!.data.data.map(i => {
          if (i.id === id) {
            return {
              ...i,
              favorites: response?.data?.contents?.[id].favorites
            }
          }
          return i
        })
        return _data
      })
    },
    [currentUser, mutateCurrentUser]
  )

  const toggleLike = useCallback(
    async (id: string) => {
      if (!session) {
        toast.warning('Please sign in', {
          position: 'top-center'
        })
      }
      let response: UpdatedContentsResponse
      const isLike = currentUser?.likedIds?.includes(id)
      if (isLike) {
        response = await axios.delete('/api/contents/like', {
          data: { contentId: id }
        })
      } else {
        response = await axios.post(`/api/contents/like`, {
          contentId: id
        })
      }
      const updatedLikeIds = response?.data?.likedIds as string[]
      mutateCurrentUser({ ...currentUser!, likedIds: updatedLikeIds })
      mutateContents(_data => {
        _data!.data.data = _data!.data.data.map(i => {
          if (i.id === id) {
            return {
              ...i,
              likes: response?.data?.contents?.[id].likes
            }
          }
          return i
        })
        return _data
      })
    },
    [currentUser, mutateCurrentUser]
  )

  const toggleNoInterested = useCallback(
    async (id: string) => {
      if (!session) {
        toast.warning('Please sign in', {
          position: 'top-center'
        })
      }
      let response: UpdatedContentsResponse
      const isNoInterested = currentUser?.noInterestedIds?.includes(id)
      if (isNoInterested) {
        response = await axios.delete('/api/contents/nointerested', {
          data: { contentId: id }
        })
      } else {
        response = await axios.post(`/api/contents/nointerested`, {
          contentId: id
        })
      }
      const updatedNoInterestedIds = response?.data?.noInterestedIds as string[]
      mutateCurrentUser({
        ...currentUser!,
        noInterestedIds: updatedNoInterestedIds
      })
      mutateContents(_data => {
        _data!.data.data = _data!.data.data.map(i => {
          if (i.id === id) {
            return {
              ...i,
              noInteresteds: response?.data?.contents?.[id].noInteresteds
            }
          }
          return i
        })
        return _data
      })
    },
    [currentUser, mutateCurrentUser]
  )

  // if (isLoading) return <Loading />

  return (
    <Wrapper>
      <h1>{title}</h1>
      <div className="mb-4 space-x-3">
        <span className="mb-1 inline-block text-sm font-medium">
          items/page:
        </span>
        <Buttons
          items={[20, 50, 80, 100]}
          current={pageSize[category]}
          onClick={handlePageSize}
        />
      </div>
      <div className="flex space-x-4">
        <SwitchOpen
          text="Fvorited"
          enabled={onlyFavorited}
          setEnabled={handleOnlyFavorited}
        />
        <SwitchOpen
          text="Liked"
          enabled={onlyLiked}
          setEnabled={handleOnlyLiked}
        />
        <SwitchOpen
          text="Interested"
          enabled={hiddenNoInterested}
          setEnabled={handleHiddenNoInterested}
        />
      </div>
      {res.data.map((i, ix) => {
        return (
          <Content
            key={i.id}
            id={i.id}
            ix={(pageNumber[category] - 1) * pageSize[category] + ix}
            title={i.title}
            content={i.content}
            originHref={i.originHref}
            favorites={i.favorites}
            likes={i.likes}
            // noInteresteds={i.noInteresteds}
            isFavorite={currentUser?.favoriteIds?.includes(i.id)}
            isLike={currentUser?.likedIds?.includes(i.id)}
            isNoInterested={currentUser?.noInterestedIds?.includes(i.id)}
            onFavorite={toggleFavorite}
            onLike={toggleLike}
            onNoInterested={toggleNoInterested}
          />
        )
      })}
      {res.data.length === 0 && (
        <div className="py-6 text-center text-gray-500">
          No content, try turn on the filter switch
        </div>
      )}
      {res.data.length ? (
        <Pagination
          pageNumber={pageNumber[category]}
          pageSize={pageSize[category]}
          total={res.total}
          onClick={handlePagination}
        />
      ) : null}
    </Wrapper>
  )
}
