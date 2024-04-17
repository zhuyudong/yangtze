import { isEmpty } from 'lodash'
import type { FC } from 'react'

import type { MovieInterface } from '@/app/[locale]/(movie)/_components/MovieCard'
import { MovieCard } from '@/app/[locale]/(movie)/_components/MovieCard'

interface MovieListProps {
  data: MovieInterface[]
  title: string
}

export const MovieList: FC<MovieListProps> = ({ data, title }) => {
  if (isEmpty(data)) {
    return null
  }

  return (
    <div className="mt-4 space-y-8 px-4 md:px-12">
      <div>
        <p className="text-md mb-4 font-semibold text-white md:text-xl lg:text-2xl">
          {title}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {data.map(movie => (
            <MovieCard key={movie.id} data={movie} />
          ))}
        </div>
      </div>
    </div>
  )
}
