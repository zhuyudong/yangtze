import type { AxiosResponse } from 'axios'

export type UpdatedContents = {
  favoriteIds: string[]
  likedIds: string[]
  noInterestedIds: string[]
  contents: {
    [contentId: string]: {
      favorites: number
      likes: number
      noInteresteds: number
    }
  }
}
export type UpdatedContentsResponse = AxiosResponse<UpdatedContents>
