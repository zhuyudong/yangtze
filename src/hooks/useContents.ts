'use client'

import type Prisma from '@prisma/client'
import useSwr from 'swr'

import fetcher from '@/libs/fetcher'

export const useContentList = (catefory: string) => {
  const { data, error, isLoading } = useSwr<Prisma.Content[]>(
    `/api/contents?category=${catefory}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  )
  return {
    data,
    error,
    isLoading
  }
}
