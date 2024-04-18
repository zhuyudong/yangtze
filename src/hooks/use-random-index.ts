import { create } from 'zustand'

import movieQuotes from '@/resources/movie-quotes.json'
import poetry from '@/resources/poetry.json'

type UseRandomIndexProps = {
  randomMovieQuoteIndex: number
  randomPoetryIndex: number
  setRandomIndex: () => void
}

export const useRandomIndex = create<UseRandomIndexProps>(set => ({
  randomMovieQuoteIndex: 0,
  randomPoetryIndex: 0,
  setRandomIndex: () =>
    set(() => ({
      randomMovieQuoteIndex: Math.floor(Math.random() * movieQuotes.length),
      randomPoetryIndex: Math.floor(Math.random() * poetry.length)
    }))
}))
