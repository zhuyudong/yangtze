'use client'

import type Prisma from '@prisma/client'
import { useRequest } from 'ahooks'
import axios from 'axios'
// import useSwr from 'swr'

// import fetcher from '@/lib/fetcher'

type Parameters = {
  category?: string
  page_size?: number
  page_number?: number
}

const findContents = async (params: Parameters) => {
  return axios.get<{
    data: Prisma.Content[]
    total: number
    prev: number | null
    next: number | null
  }>(
    `/api/contents?category=${params.category}&page_number=${params.page_number}&page_size=${params.page_size}`
  )
}

export const useContentList = (params: Parameters) => {
  // const { data, error, isLoading } = useSwr<Prisma.Content[]>(
  //   `/api/contents?category=${category}`,
  //   fetcher,
  //   {
  //     revalidateIfStale: false,
  //     revalidateOnFocus: true,
  //     revalidateOnReconnect: true
  //   }
  // )
  // return {
  //   data,
  //   error,
  //   isLoading
  // }
  const { data, error, loading, run } = useRequest(
    (_params: Parameters) => {
      return findContents({
        category: _params?.category || params?.category,
        page_number: _params?.page_number || params?.page_number,
        page_size: _params?.page_size || params?.page_size
      })
    },
    {
      // onSuccess(data, params) {
      //   console.log('onSuccess', data, params)
      // }
    }
  )

  return { data, error, isLoading: loading, run }
}
