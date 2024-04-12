'use client'

import useSwr from 'swr'

import fetcher from '@/libs/fetcher'

export const useFavorites = () => {
  const { data, error, isLoading, mutate } = useSwr('/api/favorites', fetcher, {
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
