'use client'

import useSwr from 'swr'

import fetcher from '@/lib/fetcher'

export const useBillboard = () => {
  const { data, error, isLoading } = useSwr('/api/movies/random', fetcher, {
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
