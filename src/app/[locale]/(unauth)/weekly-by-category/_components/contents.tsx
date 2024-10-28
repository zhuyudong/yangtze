/* eslint-disable react-hooks/exhaustive-deps */

'use client'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'

// import { Loading } from '@/components/loading'
import { wrapper as Wrapper } from '@/components/mdx-components'
import type { WeeklyCategory } from '@/hooks'
import { useContents, useContentsPagination, useCurrentUser } from '@/hooks'
import axios from '@/lib/axios'

import { Buttons } from './buttons'
import { Content } from './content'
import { Pagination } from './pagination'
import SwitchOpen from './switch'
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
  const t = useTranslations('User')
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
  } = useContentsPagination()
  const { mutate: mutateCurrentUser } = useCurrentUser()

  const res = useMemo(() => {
    const d = {
      data: data?.data.data ?? [],
      total: data?.data.total ?? 0,
      prev: data?.data.prev,
      next: data?.data.next
    }
    return d
  }, [data?.data.data])

  const handlePagination = useCallback(
    (page_number: number) => {
      setPageNumber(category, page_number)
      run({
        category,
        page_number,
        page_size: pageSize[category],
        onlyFavorited,
        onlyLiked,
        hiddenNoInterested
      })
    },
    [category, run, pageSize, onlyFavorited, onlyLiked, hiddenNoInterested]
  )

  const handlePageSize = useCallback(
    (page_size: number | string) => {
      setPageSize(category, page_size as number)
      run({
        category,
        page_number: pageNumber[category],
        page_size: page_size as number,
        onlyFavorited,
        onlyLiked,
        hiddenNoInterested
      })
    },
    [
      category,
      run,
      setPageSize,
      pageNumber[category],
      onlyFavorited,
      onlyLiked,
      hiddenNoInterested
    ]
  )

  const handleOnlyFavorited = useCallback(() => {
    if (!session) {
      return toast.warning(t('please_sign_in'), {
        position: 'top-center'
      })
    }
    const _onlyFavorited = onlyFavorited === 'true' ? 'false' : 'true'
    setFilter('onlyFavorited', _onlyFavorited)
    run({
      category,
      page_number: pageNumber[category],
      page_size: pageSize[category],
      onlyFavorited: _onlyFavorited
    })
  }, [category, run, onlyFavorited, pageNumber, pageSize, category])

  const handleOnlyLiked = useCallback(() => {
    if (!session) {
      return toast.warning(t('please_sign_in'), {
        position: 'top-center'
      })
    }
    const _onlyLiked = onlyLiked === 'true' ? 'false' : 'true'
    setFilter('onlyLiked', _onlyLiked)
    run({
      category,
      page_number: pageNumber[category],
      page_size: pageSize[category],
      onlyLiked: _onlyLiked
    })
  }, [category, run, pageNumber, pageSize, onlyLiked])

  const handleHiddenNoInterested = useCallback(() => {
    if (!session) {
      return toast.warning(t('please_sign_in'), {
        position: 'top-center'
      })
    }
    const _hiddenNoInterested = hiddenNoInterested === 'true' ? 'false' : 'true'
    setFilter('hiddenNoInterested', _hiddenNoInterested)
    run({
      category,
      page_number: pageNumber[category],
      page_size: pageSize[category],
      hiddenNoInterested: _hiddenNoInterested
    })
  }, [category, run, pageNumber, pageSize, hiddenNoInterested])

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!session) {
        return toast.warning(t('please_sign_in'), {
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
      const updatedFavoriteIds = response?.data?.favoriteIds

      await mutateCurrentUser({
        ...currentUser!,
        favoriteIds: updatedFavoriteIds
      })
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
        if (onlyFavorited === 'true') {
          _data!.data.data = _data!.data.data.filter(i => {
            return updatedFavoriteIds.includes(i.id)
          })
        }
        if (onlyLiked === 'true') {
          _data!.data.data = _data!.data.data.filter(i => {
            return currentUser?.likedIds.includes(i.id)
          })
        }
        if (hiddenNoInterested === 'true') {
          _data!.data.data = _data!.data.data.filter(i => {
            return !currentUser?.noInterestedIds.includes(i.id)
          })
        }
        return _data
      })
    },
    [currentUser, mutateCurrentUser]
  )

  const toggleLike = useCallback(
    async (id: string) => {
      if (!session) {
        return toast.warning(t('please_sign_in'), {
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
      const updatedLikeIds = response?.data?.likedIds
      await mutateCurrentUser({ ...currentUser!, likedIds: updatedLikeIds })
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
        if (onlyFavorited === 'true') {
          _data!.data.data = _data!.data.data.filter(i => {
            return currentUser?.favoriteIds.includes(i.id)
          })
        }
        if (onlyLiked === 'true') {
          _data!.data.data = _data!.data.data.filter(i => {
            return updatedLikeIds.includes(i.id)
          })
        }
        if (hiddenNoInterested === 'true') {
          _data!.data.data = _data!.data.data.filter(i => {
            return !currentUser?.noInterestedIds.includes(i.id)
          })
        }
        return _data
      })
    },
    [currentUser, mutateCurrentUser]
  )

  const toggleNoInterested = useCallback(
    async (id: string) => {
      if (!session) {
        return toast.warning(t('please_sign_in'), {
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
      const updatedNoInterestedIds = response?.data?.noInterestedIds
      await mutateCurrentUser({
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
        if (onlyFavorited === 'true') {
          _data!.data.data = _data!.data.data.filter(i => {
            return currentUser?.favoriteIds.includes(i.id)
          })
        }
        if (onlyLiked === 'true') {
          _data!.data.data = _data!.data.data.filter(i => {
            return currentUser?.likedIds.includes(i.id)
          })
        }
        if (hiddenNoInterested === 'true') {
          _data!.data.data = _data!.data.data.filter(i => {
            return !updatedNoInterestedIds.includes(i.id)
          })
        }
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
          items={[20, 50, 100, 10000]}
          current={pageSize[category]}
          onClick={handlePageSize}
        />
      </div>
      <div className="flex space-x-4">
        <SwitchOpen
          text="Fvorited"
          enabled={onlyFavorited === 'true'}
          setEnabled={handleOnlyFavorited}
        />
        <SwitchOpen
          text="Liked"
          enabled={onlyLiked === 'true'}
          setEnabled={handleOnlyLiked}
        />
        <SwitchOpen
          text="Interested"
          enabled={hiddenNoInterested === 'true'}
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
          No content, try turn off the filter switch
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
