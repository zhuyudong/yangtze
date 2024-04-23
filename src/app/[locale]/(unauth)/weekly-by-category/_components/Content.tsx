import { HeartIcon, StarIcon } from '@heroicons/react/24/solid'
import type Prisma from '@prisma/client'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import clsx from 'clsx'
// import { useSession } from 'next-auth/react'
import { useCallback, useMemo } from 'react'
import Markdown from 'react-markdown'

import { HeartIcon as HeartIconOutline } from '@/components/icons/HeartIcon'
import { StarIcon as StarIconOutline } from '@/components/icons/StarIcon'
import { XMarkIcon } from '@/components/icons/XMarkIcon'
import { useContentsRemoteState, useCurrentUser } from '@/hooks'

import InterestedLine from './InterestedLine'

type ContentsState = {
  likedIds: string[] // Prisma.User
  favoriteIds: string[]
  noInterestedIds: string[]
  contents: Record<
    string,
    {
      favorites: number
      likes: number
      noInteresteds: number
    }
  > // Prisma.Content
}
type ContentsStateResponse = AxiosResponse<ContentsState>

export const Content = ({
  id,
  ix,
  title,
  content,
  originHref,
  currentUser,
  contentsState
}: {
  id: string
  ix: number
  title: string
  content: string
  originHref?: string | null
  currentUser?: Prisma.User
  contentsState?: ContentsState
}) => {
  // const { data: session } = useSession()
  const { mutate } = useCurrentUser()
  const { mutate: mutateState } = useContentsRemoteState()
  const t = useMemo(() => {
    return title.startsWith('**') && title.endsWith('**')
      ? title.slice(2, -2)
      : title?.split('](')?.[0]?.slice(1)
  }, [title])

  const isFavorite = useMemo(() => {
    return currentUser?.favoriteIds?.includes(id) as boolean
  }, [currentUser?.favoriteIds, id])

  const isLike = useMemo(() => {
    return currentUser?.likedIds?.includes(id) as boolean
  }, [currentUser?.likedIds, id])

  const isNoInterested = useMemo(() => {
    return currentUser?.noInterestedIds?.includes(id) as boolean
  }, [currentUser?.noInterestedIds, id])

  const FavoriteIcon = isFavorite ? StarIcon : StarIconOutline
  const LikeIcon = isLike ? HeartIcon : HeartIconOutline

  const toggleFavorite = useCallback(async () => {
    let response: ContentsStateResponse
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
    mutate({ ...currentUser!, favoriteIds: updatedFavoriteIds })
    mutateState({
      likedIds: contentsState?.likedIds as string[],
      noInterestedIds: contentsState?.noInterestedIds as string[],
      // ...contentState,
      favoriteIds: updatedFavoriteIds,
      contents: {
        ...contentsState?.contents!,
        [id]: {
          likes: contentsState?.contents?.[id]?.likes as number,
          noInteresteds: contentsState?.contents?.[id]?.noInteresteds as number,
          // ...contentState?.contents?.[id],
          favorites: response?.data?.contents?.[id]?.favorites as number
        }
      }
    })
  }, [id, isFavorite, currentUser, contentsState, mutate])

  const toggleLike = useCallback(async () => {
    let response: ContentsStateResponse
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
    mutate({ ...currentUser!, likedIds: updatedLikeIds })
    mutateState({
      favoriteIds: contentsState?.favoriteIds as string[],
      noInterestedIds: contentsState?.noInterestedIds as string[],
      likedIds: updatedLikeIds,
      contents: {
        ...contentsState?.contents!,
        [id]: {
          favorites: contentsState?.contents?.[id]?.favorites as number,
          noInteresteds: contentsState?.contents?.[id]?.noInteresteds as number,
          likes: response?.data?.contents?.[id]?.likes as number
        }
      }
    })
  }, [id, currentUser, isLike, contentsState, mutate])

  const toggleNoInterested = useCallback(async () => {
    let response: ContentsStateResponse
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
    mutate({ ...currentUser!, noInterestedIds: updatedNoInterestedIds })
    mutateState({
      favoriteIds: contentsState?.favoriteIds as string[],
      likedIds: contentsState?.likedIds as string[],
      noInterestedIds: updatedNoInterestedIds,
      contents: {
        ...contentsState?.contents!,
        [id]: {
          likes: contentsState?.contents?.[id]?.likes as number,
          favorites: contentsState?.contents?.[id]?.favorites as number,
          noInteresteds: response?.data?.contents?.[id]?.noInteresteds as number
        }
      }
    })
  }, [id, currentUser, isNoInterested, contentsState, mutate])

  if (isNoInterested) {
    return <InterestedLine key={id} id={id} />
  }

  return (
    <div key={id}>
      <h2>
        <a target="_blank" href={originHref!}>{`${ix + 1}. ${t}`}</a>
      </h2>
      <Markdown>{content}</Markdown>
      <div className="flex justify-between">
        <div className="flex gap-3">
          <button
            type="button"
            className="inline-flex space-x-2 rounded-sm bg-white px-2 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={toggleFavorite}
          >
            <FavoriteIcon className="w-6 cursor-pointer" />
            <span className="w-4 text-base text-indigo-400">
              {contentsState?.contents?.[id]?.favorites ?? 0}
            </span>
          </button>
          <button
            type="button"
            className="inline-flex space-x-2 rounded-sm bg-white px-2 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={toggleLike}
          >
            <LikeIcon
              className={clsx(
                'mt-[2px] w-6 cursor-pointer',
                isLike && 'text-red-500'
              )}
            />
            <span className="w-4 text-base text-indigo-400">
              {contentsState?.contents?.[id]?.likes ?? 0}
            </span>
          </button>
        </div>
        <XMarkIcon
          className="mt-[2px] w-6 cursor-pointer"
          onClick={toggleNoInterested}
        />
      </div>
      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
      </div>
    </div>
  )
}
