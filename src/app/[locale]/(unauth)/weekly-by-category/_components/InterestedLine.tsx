import axios from 'axios'
import { useCallback, useMemo } from 'react'

import { useContentsRemoteState, useCurrentUser } from '@/hooks'

import type { ContentsStateResponse } from './Content'

export default function InterestedLine({ id }: { id: string }) {
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser()
  const { data: contentsState, mutate: mutateContentsState } =
    useContentsRemoteState()

  const isNoInterested = useMemo(() => {
    return currentUser?.noInterestedIds?.includes(id) as boolean
  }, [currentUser?.noInterestedIds, id])

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
    mutateCurrentUser({
      ...currentUser!,
      noInterestedIds: updatedNoInterestedIds
    })
    mutateContentsState({
      // favoriteIds: contentsState?.favoriteIds as string[],
      // likedIds: contentsState?.likedIds as string[],
      ...contentsState,
      noInterestedIds: updatedNoInterestedIds,
      // @ts-ignore
      contents: {
        ...contentsState?.contents!,
        [id]: {
          // likes: contentsState?.contents?.[id]?.likes as number,
          // favorites: contentsState?.contents?.[id]?.favorites as number,
          ...contentsState?.contents?.[id],
          noInteresteds: response?.data?.contents?.[id]?.noInteresteds as number
        }
      }
    })
  }, [
    id,
    currentUser,
    isNoInterested,
    contentsState,
    mutateCurrentUser,
    mutateContentsState
  ])

  return (
    <div className="relative mb-[-36px] mt-16">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div
        className="relative flex cursor-pointer justify-center"
        onClick={toggleNoInterested}
      >
        <span className="bg-white px-2 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
        </span>
      </div>
    </div>
  )
}
