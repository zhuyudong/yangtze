import { HeartIcon, StarIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { useMemo } from 'react'
import Markdown from 'react-markdown'

import { HeartIcon as HeartIconOutline } from '@/components/icons/HeartIcon'
import { StarIcon as StarIconOutline } from '@/components/icons/StarIcon'
import { XMarkIcon } from '@/components/icons/XMarkIcon'

import { NoInterestedLine } from './NoInterestedLine'

const r =
  /\[[\u4e00-\u9fa5\u3000-\u303F《》()（）"“”`%?？·a-zA-Z,，。：,.\d\s+-~～]+\]\((https?:\/\/[a-zA-Z.\-_\d/?@~+:&=%#]*)\)/

export const Content = ({
  id,
  ix,
  title,
  content,
  originHref,
  favorites,
  likes,
  // noInteresteds,
  isFavorite,
  isLike,
  isNoInterested,
  onFavorite,
  onLike,
  onNoInterested
}: {
  id: string
  ix: number
  title: string
  content: string
  originHref?: string | null
  favorites: number
  likes: number
  // noInteresteds: number
  isFavorite?: boolean
  isLike?: boolean
  isNoInterested?: boolean
  onFavorite: (id: string) => void
  onLike: (id: string) => void
  onNoInterested: (id: string) => void
}) => {
  const t = useMemo(() => {
    return title.startsWith('**') && title.endsWith('**')
      ? title.slice(2, -2)
      : title.match(r)
        ? `${title?.split('](')?.[0]?.slice(1)}${title.replace(r, '')}`
        : title // title?.split('](')?.[0]?.slice(1)
  }, [title])

  const FavoriteIcon = isFavorite ? StarIcon : StarIconOutline
  const LikeIcon = isLike ? HeartIcon : HeartIconOutline

  if (isNoInterested) {
    return <NoInterestedLine key={id} id={id} />
  }

  return (
    <div key={id}>
      <h2>
        <a target="_blank" href={originHref!}>{`${ix + 1}. ${t}`}</a>
      </h2>
      <Markdown>{content}</Markdown>
      <div className="flex justify-between">
        <div className="flex gap-3">
          <button
            type="button"
            className="inline-flex space-x-2 rounded-sm bg-white px-2 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => onFavorite(id)}
          >
            <FavoriteIcon className="w-6 cursor-pointer" />
            <span className="w-4 text-base text-indigo-400">
              {favorites ?? 0}
            </span>
          </button>
          <button
            type="button"
            className="inline-flex space-x-2 rounded-sm bg-white px-2 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => onLike(id)}
          >
            <LikeIcon
              className={clsx(
                'mt-[2px] w-6 cursor-pointer',
                isLike && 'text-red-500'
              )}
            />
            <span className="w-4 text-base text-indigo-400">{likes ?? 0}</span>
          </button>
        </div>
        <XMarkIcon
          className="mt-[2px] w-6 cursor-pointer"
          onClick={() => onNoInterested(id)}
        />
      </div>
      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
      </div>
    </div>
  )
}
