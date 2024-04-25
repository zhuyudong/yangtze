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

type UsePaginationProps = {
  pageSize: Record<WeeklyCategory, number>
  pageNumber: Record<WeeklyCategory, number>
  setPageSize: (category: string, num: number) => void
  setPageNumber: (category: string, num: number) => void
}

export const usePagination = create<UsePaginationProps>((set, get) => ({
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
}))
