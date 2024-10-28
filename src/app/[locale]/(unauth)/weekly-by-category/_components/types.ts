import type { AxiosResponse } from 'axios'

export interface UpdatedContents {
  favoriteIds: string[]
  likedIds: string[]
  noInterestedIds: string[]
  contents: Record<
    string,
    {
      favorites: number
      likes: number
      noInteresteds: number
    }
  >
}
export type UpdatedContentsResponse = AxiosResponse<UpdatedContents>
