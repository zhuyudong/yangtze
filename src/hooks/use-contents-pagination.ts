import { create } from 'zustand'

export type WeeklyCategory =
  | 'article'
  | 'photo'
  | 'new'
  | 'excerpt'
  | 'resource'
  | 'quotation'
  | 'technology-new'
  | 'tool'

type BooleanValue = 'true' | 'false'

type UseContentsPaginationProps = {
  currentCategory: WeeklyCategory | null
  pageSize: Record<WeeklyCategory, number>
  pageNumber: Record<WeeklyCategory, number>
  onlyFavorited: BooleanValue
  onlyLiked: BooleanValue
  hiddenNoInterested: BooleanValue
  setFilter: (
    filter: 'onlyFavorited' | 'onlyLiked' | 'hiddenNoInterested',
    value: BooleanValue
  ) => void
  setCurrentCategory: (category: WeeklyCategory) => void
  setPageSize: (category: string, num: number) => void
  setPageNumber: (category: string, num: number) => void
}

export const useContentsPagination = create<UseContentsPaginationProps>(
  (set, get) => ({
    currentCategory: null,
    pageSize: {
      'article': 20,
      'photo': 20,
      'new': 20,
      'excerpt': 20,
      'resource': 20,
      'quotation': 20,
      'technology-new': 20,
      'tool': 20
    },
    pageNumber: {
      'article': 1,
      'photo': 1,
      'new': 1,
      'excerpt': 1,
      'resource': 1,
      'quotation': 1,
      'technology-new': 1,
      'tool': 1
    },
    onlyFavorited: 'false',
    onlyLiked: 'false',
    hiddenNoInterested: 'false',
    setFilter: (filter, value) => set(() => ({ [filter]: value })),
    setCurrentCategory: category => set(() => ({ currentCategory: category })),
    setPageSize: (category, num) =>
      set(() => ({
        pageSize: {
          ...get().pageSize,
          [category]: num
        }
      })),
    setPageNumber: (category, num) =>
      set(() => ({
        pageNumber: {
          ...get().pageNumber,
          [category]: num
        }
      }))
  })
)
