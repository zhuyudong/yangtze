import { create } from 'zustand'

type UseNoInterestedProps = {
  isFavorite: Record<string, boolean>
  isLike: Record<string, boolean>
  isNoInterested: Record<string, boolean>
  setFavorite: (id: string, favorite: boolean) => void
  setLike: (id: string, like: boolean) => void
  setNoInterested: (id: string, interested: boolean) => void
}

export const useContentLocalState = create<UseNoInterestedProps>(
  (set, get) => ({
    isFavorite: {},
    isLike: {},
    isNoInterested: {},
    setFavorite: (id, favorite) =>
      set(() => ({
        isFavorite: {
          ...get().isFavorite,
          [id]: favorite
        }
      })),
    setLike: (id, like) =>
      set(() => ({
        isLike: {
          ...get().isLike,
          [id]: like
        }
      })),
    setNoInterested: (id, noInterested) =>
      set(() => ({
        isNoInterested: {
          ...get().isNoInterested,
          [id]: noInterested
        }
      }))
  })
)
