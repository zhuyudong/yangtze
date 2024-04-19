'use client'

import { HeartIcon, StarIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { useState } from 'react'
import Markdown from 'react-markdown'

import { HeartIcon as HeartIconOutline } from '@/components/icons/HeartIcon'
import { StarIcon as StarIconOutline } from '@/components/icons/StarIcon'
import { XMarkIcon } from '@/components/icons/XMarkIcon'
import { Loading } from '@/components/Loading'
import { wrapper as Wrapper } from '@/components/mdx'
import { useContentList, useNoInterested } from '@/hooks'

import InterestedLine from '../_components/InterestedLine'

export default function Excerpts() {
  const { isNoInterested, setNoInterested } = useNoInterested()
  const [isFavorite, setIsFavorite] = useState<Record<string, boolean>>({})
  const [isLike, setIsLike] = useState<Record<string, boolean>>({})
  const { data: contents = [], isLoading } = useContentList('article')

  if (isLoading) return <Loading />

  return (
    <Wrapper>
      <h1>文摘</h1>
      {contents.map((i, ix) => {
        if (isNoInterested[i.id]) {
          return <InterestedLine key={i.id} id={i.id} />
        }
        const title = i?.title?.split('](')?.[0]?.slice(1)
        const FavoriteIcon = isFavorite[i.id] ? StarIcon : StarIconOutline
        const LikeIcon = isLike[i.id] ? HeartIcon : HeartIconOutline
        return (
          <div key={i.id}>
            <h2>
              <a
                target="_blank"
                href={i.originHref!}
              >{`${ix + 1}. ${title}`}</a>
            </h2>
            <Markdown>{i.content}</Markdown>
            <div className="flex justify-between">
              <div className="flex gap-3">
                <FavoriteIcon
                  className="w-6 cursor-pointer"
                  onClick={() =>
                    setIsFavorite({ ...isFavorite, [i.id]: !isFavorite[i.id] })
                  }
                />
                <LikeIcon
                  className={clsx(
                    'mt-[2px] w-6 cursor-pointer',
                    isLike && 'text-red-500'
                  )}
                  onClick={() =>
                    setIsLike({ ...isLike, [i.id]: !isLike[i.id] })
                  }
                />
              </div>
              <XMarkIcon
                className="mt-[2px] w-6 cursor-pointer"
                onClick={() => setNoInterested(i.id, !isNoInterested[i.id])}
              />
            </div>
            <div className="relative mt-4">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              {/* <div className="relative flex justify-start">
                <span className="bg-white pr-2 text-sm text-gray-500">
                  Continue
                </span>
              </div> */}
            </div>
          </div>
        )
      })}
    </Wrapper>
  )
}
