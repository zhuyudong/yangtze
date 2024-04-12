import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useParams, useRouter } from 'next/navigation'

import { useMovie } from '@/hooks/useMovie'

const Watch = () => {
  const router = useRouter()
  const params = useParams()
  console.log('params: ', params)
  const { data } = useMovie(params!.movieId as string)

  return (
    <div className="h-screen w-screen bg-black">
      <nav className="fixed z-10 flex w-full flex-row items-center gap-8 bg-black bg-opacity-70 p-4">
        <ArrowLeftIcon
          onClick={() => router.push('/')}
          className="w-4 cursor-pointer text-white transition hover:opacity-80 md:w-10"
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
