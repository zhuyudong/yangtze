'use client'

import useSwr from 'swr'

import fetcher from '@/libs/fetcher'

export const useMovieList = () => {
  const { data, error, isLoading } = useSwr('/api/movies', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })
  return {
    data,
    error,
    isLoading
  }
}
