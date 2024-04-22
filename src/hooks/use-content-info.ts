'use client'

import useSwr from 'swr'

import fetcher from '@/lib/fetcher'

export const useContentInfo = () => {
  const { data, error, isLoading } = useSwr('/api/contents/info', fetcher, {
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
