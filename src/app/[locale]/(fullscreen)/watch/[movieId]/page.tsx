'use client'

import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useParams, useRouter } from 'next/navigation'

import { useMovie } from '@/hooks'

const Watch = () => {
  const router = useRouter()
  const params = useParams()
  const { data } = useMovie(params!.movieId as string)

  return (
    <div className="h-screen w-screen bg-black">
      <nav className="bg-opacity/70 fixed z-10 flex w-full flex-row items-center gap-8 bg-black p-4">
        <ArrowLeftIcon
          onClick={() => router.push('/')}
          className="hover:opacity/80 w-4 cursor-pointer text-white transition md:w-10"
        />
        <p className="text-1xl font-bold text-white md:text-3xl">
          <span className="font-light">Watching:</span> {data?.title}
        </p>
      </nav>
      <video className="size-full" autoPlay controls src={data?.videoUrl} />
    </div>
  )
}

export default Watch
