'use client'

import { useSession } from 'next-auth/react'
import { useCallback, useMemo, useState } from 'react'
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
  const { pageSize, pageNumber, setPageSize, setPageNumber } = usePagination()
  const [favoritedEnabled, setFavoritedEnabled] = useState(false)
  const [likedEnabled, setLikedEnabled] = useState(false)
  const [hiddenNoInterestedEnabled, setHiddenNoInterestedEnabled] =
    useState(false)
  const { mutate: mutateCurrentUser } = useCurrentUser()

  const res = useMemo(() => {
    return {
      data: data?.data.data || [],
      total: data?.data.total || 0,
      prev: data?.data.prev,
      next: data?.data.next
    }
  }, [data?.data.data])

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
    setFavoritedEnabled(!favoritedEnabled)
  }, [favoritedEnabled])

  const handleOnlyLiked = useCallback(() => {
    setLikedEnabled(!likedEnabled)
  }, [likedEnabled])

  const handleHiddenNoInterested = useCallback(() => {
    setHiddenNoInterestedEnabled(!hiddenNoInterestedEnabled)
  }, [hiddenNoInterestedEnabled])

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
        <span className="mb-1 inline-block text-sm text-gray-700">
          items/page:
        </span>
        <Buttons
          items={[20, 40, 60, 80, 100]}
          current={pageSize[category]}
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
      <Pagination
        pageNumber={pageNumber[category]}
        pageSize={pageSize[category]}
        total={res.total}
        onClick={handlePagination}
      />
    </Wrapper>
  )
}
