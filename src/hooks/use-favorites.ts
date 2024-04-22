'use client'

import useSwr from 'swr'

import fetcher from '@/lib/fetcher'

export const useFavorites = () => {
  const { data, error, isLoading, mutate } = useSwr(
    '/api/movies/favorites',
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )
  return {
    data,
    error,
    isLoading,
    mutate
  }
}
