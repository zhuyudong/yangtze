'use client'

import type Prisma from '@prisma/client'
import useSwr from 'swr'

import fetcher from '@/lib/fetcher'

export const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSwr<Prisma.User>(
    '/api/current',
    fetcher
  )
  return {
    data,
    error,
    isLoading,
    mutate
  }
}
