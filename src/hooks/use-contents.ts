'use client'

import type Prisma from '@prisma/client'
import { useRequest } from 'ahooks'

import axios from '@/lib/axios'

import type { WeeklyCategory } from './use-contents-pagination'
import { useContentsPagination } from './use-contents-pagination'
// import useSwr from 'swr'

// import fetcher from '@/lib/fetcher'

type Parameters = {
  category?: string
  page_size?: number
  page_number?: number
  onlyFavorited?: 'true' | 'false'
  onlyLiked?: 'true' | 'false'
  hiddenNoInterested?: 'true' | 'false'
}

const findContents = async ({
  category,
  page_number,
  page_size,
  onlyFavorited,
  onlyLiked,
  hiddenNoInterested
}: Parameters) => {
  return axios.get<{
    data: Prisma.Content[]
    total: number
    prev: number | null
    next: number | null
  }>(
    `/api/contents?category=${category}&page_number=${page_number}&page_size=${page_size}&onlyFavorited=${onlyFavorited}&onlyLiked=${onlyLiked}&hiddenNoInterested=${hiddenNoInterested}`
  )
}

export const useContents = (params?: Parameters) => {
  // const c = window.location.pathname
  //   .match(/weekly-by-category\/([a-zA-Z-]+)/)?.[1]
  //   .slice(0, -1)
  const { currentCategory, pageNumber, pageSize } = useContentsPagination()

  const { data, error, loading, run, mutate } = useRequest(
    (_params: Parameters) => {
      return findContents({
        category:
          _params?.category ||
          params?.category ||
          (currentCategory as WeeklyCategory),
        page_number:
          _params?.page_number ||
          params?.page_number ||
          (currentCategory && pageNumber[currentCategory as WeeklyCategory]) ||
          1,
        page_size:
          _params?.page_size ||
          params?.page_size ||
          (currentCategory && pageSize[currentCategory as WeeklyCategory]) ||
          20,
        onlyFavorited:
          _params?.onlyFavorited || params?.onlyFavorited || 'false',
        onlyLiked: _params?.onlyLiked || params?.onlyLiked || 'false',
        hiddenNoInterested:
          _params?.hiddenNoInterested || params?.hiddenNoInterested || 'false'
      })
    },
    {
      // manual: true
      // onSuccess(data, params) {
      //   console.log('onSuccess', data, params)
      // }
    }
  )

  return { data, error, isLoading: loading, run, mutate }
}
