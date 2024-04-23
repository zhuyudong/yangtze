'use client'

import useSwr from 'swr'

import fetcher from '@/lib/fetcher'

export const useContentsRemoteState = () => {
  const { data, error, isLoading, mutate } = useSwr<{
    contents: Record<
      string,
      {
        favorites: number
        likes: number
        noInteresteds: number
      }
    >
    favoriteIds: string[]
    likedIds: string[]
    noInterestedIds: string[]
  }>('/api/contents/state', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })
  return {
    data,
    error,
    isLoading,
    mutate
  }
}
