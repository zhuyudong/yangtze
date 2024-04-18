import { create } from 'zustand'

import wallpaper from '@/resources/bing_wallpaper.json'
import movieQuotes from '@/resources/movie_quotes.json'
import poetry from '@/resources/poetry.json'

type UseRandomIndexProps = {
  randomPoetryIndex: number
  randomWallpaperIndex: number
  randomMovieQuoteIndex: number
  setRandomIndex: () => void
}

export const useRandomIndex = create<UseRandomIndexProps>(set => ({
  randomPoetryIndex: 0,
  randomWallpaperIndex: 0,
  randomMovieQuoteIndex: 0,
  setRandomIndex: () =>
    set(() => ({
      randomPoetryIndex: Math.floor(Math.random() * poetry.length),
      randomWallpaperIndex: Math.floor(Math.random() * wallpaper.length),
      randomMovieQuoteIndex: Math.floor(Math.random() * movieQuotes.length)
    }))
}))
