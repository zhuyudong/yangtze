'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import type { FC } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { FavoriteButton } from '@/components/FavoriteButton'
import { PlayButton } from '@/components/PlayButton'
import { useInfoModalStore, useMovie } from '@/hooks'

interface InfoModalProps {
  visible?: boolean
  onClose: any
}

export const InfoModal: FC<InfoModalProps> = ({ visible, onClose }) => {
  const [isVisible, setIsVisible] = useState<boolean>(!!visible)

  const { movieId } = useInfoModalStore()
  const { data = {} } = useMovie(movieId)

  useEffect(() => {
    setIsVisible(!!visible)
  }, [visible])

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }, [onClose])

  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-80 transition duration-300">
      <div className="relative mx-auto w-auto max-w-3xl overflow-hidden rounded-md">
        <div
          className={`${isVisible ? 'scale-100' : 'scale-0'} relative flex-auto bg-zinc-900 drop-shadow-md duration-300`}
        >
          <div className="relative h-96">
            <video
              poster={data?.thumbnailUrl}
              autoPlay
              muted
              loop
              src={data?.videoUrl}
              className="size-full object-cover brightness-[60%]"
            />
            <div
              onClick={handleClose}
              className="absolute right-3 top-3 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-70"
            >
              <XMarkIcon className="w-6 text-white" />
            </div>
            <div className="absolute bottom-[10%] left-10">
              <p className="mb-8 h-full text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {data?.title}
              </p>
              <div className="flex flex-row items-center gap-4">
                <PlayButton movieId={data?.id} />
                <FavoriteButton movieId={data?.id} />
              </div>
            </div>
          </div>

          <div className="px-12 py-8">
            <div className="mb-8 flex flex-row items-center gap-2">
              <p className="text-lg font-semibold text-green-400">New</p>
              <p className="text-lg text-white">{data?.duration}</p>
              <p className="text-lg text-white">{data?.genre}</p>
            </div>
            <p className="text-lg text-white">{data?.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
