import { create } from 'zustand'

type UseNoInterestedProps = {
  isNoInterested: Record<string, boolean>
  setNoInterested: (id: string, interested: boolean) => void
}

export const useNoInterested = create<UseNoInterestedProps>((set, get) => ({
  isNoInterested: {},
  setNoInterested: (id, noInterested) =>
    set(() => ({
      isNoInterested: {
        ...get().isNoInterested,
        [id]: noInterested
      }
    }))
}))
