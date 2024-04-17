'use client'

import {
  HeartIcon as HeartIconOutline,
  StarIcon as StarIconOutline
} from '@heroicons/react/24/outline'
import { HeartIcon, StarIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { useState } from 'react'
import Markdown from 'react-markdown'

import { Loading } from '@/components/Loading'
import { wrapper as Wrapper } from '@/components/mdx'
import { useContentList } from '@/hooks'

export default function Excerpts() {
  const [isFavorite, setIsFavorite] = useState<Record<string, boolean>>({})
  const [isLike, setIsLike] = useState<Record<string, boolean>>({})
  const { data: contents = [], isLoading } = useContentList('tool')

  const FavoriteIcon = isFavorite ? StarIcon : StarIconOutline
  const LikeIcon = isLike ? HeartIcon : HeartIconOutline

  if (isLoading) return <Loading />
  return (
    <Wrapper>
      <h1>开发工具</h1>
      {contents.map((i, ix) => {
        const title = i?.title?.split('](')?.[0]?.slice(1)
        return (
          <div key={i.id}>
            <h2>
              <a
                target="_blank"
                href={i.originHref!}
              >{`${ix + 1}. ${title}`}</a>
            </h2>
            <Markdown>{i.content}</Markdown>
            {/* TODO */}
            <div className="flex gap-2">
              <FavoriteIcon
                className="w-6 cursor-pointer"
                onClick={() =>
                  setIsFavorite({ ...isFavorite, [i.id]: !isFavorite[i.id] })
                }
              />
              <LikeIcon
                className={clsx('w-6 cursor-pointer', isLike && 'text-red-500')}
                onClick={() => setIsLike({ ...isLike, [i.id]: !isLike[i.id] })}
              />
            </div>
          </div>
        )
      })}
    </Wrapper>
  )
}
