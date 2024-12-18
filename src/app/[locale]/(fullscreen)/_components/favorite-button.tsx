import { CheckIcon, PlusIcon } from '@heroicons/react/24/outline'
import type { FC } from 'react'
import { useCallback, useMemo } from 'react'

import { useCurrentUser, useFavorites } from '@/hooks'
import axios from '@/lib/axios'

interface FavoriteButtonProps {
  movieId: string
}

export const FavoriteButton: FC<FavoriteButtonProps> = ({ movieId }) => {
  const { mutate: mutateFavorites } = useFavorites()

  const { data: currentUser, mutate } = useCurrentUser()

  const isFavorite = useMemo(() => {
    const list = currentUser?.favoriteIds ?? []

    return list.includes(movieId)
  }, [currentUser, movieId])

  const toggleFavorites = useCallback(async () => {
    let response

    if (isFavorite) {
      response = await axios.delete('/api/movies/favorite', {
        data: { movieId }
      })
    } else {
      response = await axios.post('/api/movies/favorite', { movieId })
    }

    const updatedFavoriteIds = response?.data?.favoriteIds

    await mutate({
      ...currentUser!,
      favoriteIds: updatedFavoriteIds
    })
    await mutateFavorites()
  }, [movieId, isFavorite, currentUser, mutate, mutateFavorites])

  const Icon = isFavorite ? CheckIcon : PlusIcon

  return (
    <div
      onClick={toggleFavorites}
      className="group/item flex size-6 cursor-pointer items-center justify-center rounded-full border-2 border-white transition hover:border-neutral-300 lg:size-10"
    >
      <Icon className="w-4 text-white group-hover/item:text-neutral-300 lg:w-6" />
    </div>
  )
}
