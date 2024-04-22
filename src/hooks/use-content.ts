'use client'

import useSwr from 'swr'

import fetcher from '@/lib/fetcher'

export const useMovieList = () => {
  const {
    data: favorites
    // error,
    // isLoading
  } = useSwr('/api/contents/favorites', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })
  const {
    data: likes
    // error,
    // isLoading
  } = useSwr('/api/contents/likes', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })
  return {
    // data,
    favorites,
    likes,
    interesteds: []
    // error,
    // isLoading
  }
}
