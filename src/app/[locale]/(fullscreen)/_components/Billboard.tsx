'use client'

import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type { FC } from 'react'
import { useCallback } from 'react'

import { PlayButton } from '@/components/PlayButton'
import { useBillboard, useInfoModalStore } from '@/hooks'

export const Billboard: FC = () => {
  const { openModal } = useInfoModalStore()
  const { data } = useBillboard()

  const handleOpenModal = useCallback(() => {
    openModal(data?.id)
  }, [openModal, data?.id])

  return (
    <div className="relative h-[56.25vw]">
      <video
        poster={data?.thumbnailUrl}
        className="h-[56.25vw] w-full object-cover brightness-[60%] transition duration-500"
        autoPlay
        muted
        loop
        src={data?.videoUrl}
      />
      <div className="absolute top-[30%] ml-4 md:top-[40%] md:ml-16">
        <p className="text-1xl h-full w-1/2 font-bold text-white drop-shadow-xl md:text-5xl lg:text-6xl">
          {data?.title}
        </p>
        <p className="mt-3 w-[90%] text-[8px] text-white drop-shadow-xl md:mt-8 md:w-4/5 md:text-lg lg:w-1/2">
          {data?.description}
        </p>
        <div className="mt-3 flex flex-row items-center gap-3 md:mt-4">
          <PlayButton movieId={data?.id} />
          <button
            onClick={handleOpenModal}
            className="flex w-auto flex-row items-center rounded-md bg-white px-2 py-1 text-xs font-semibold text-white opacity-30 transition hover:opacity-20 md:px-4 md:py-2 lg:text-lg"
          >
            <InformationCircleIcon className="mr-1 w-4 md:w-7" />
            More Info
          </button>
        </div>
      </div>
    </div>
  )
}
