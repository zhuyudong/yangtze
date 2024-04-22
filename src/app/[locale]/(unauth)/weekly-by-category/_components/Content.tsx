import { HeartIcon, StarIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import clsx from 'clsx'
// import { useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'
import Markdown from 'react-markdown'

import { HeartIcon as HeartIconOutline } from '@/components/icons/HeartIcon'
import { StarIcon as StarIconOutline } from '@/components/icons/StarIcon'
import { XMarkIcon } from '@/components/icons/XMarkIcon'
import { useNoInterested } from '@/hooks'

export const Content = ({
  id,
  ix,
  title,
  content,
  originHref
}: {
  id: string
  ix: number
  title: string
  content: string
  originHref?: string | null
}) => {
  // const { data: session } = useSession()
  const { isNoInterested, setNoInterested } = useNoInterested()
  const [isFavorite, setIsFavorite] = useState<Record<string, boolean>>({})
  const [isLike, setIsLike] = useState<Record<string, boolean>>({})

  const t =
    title.startsWith('**') && title.endsWith('**')
      ? title.slice(2, -2)
      : title?.split('](')?.[0]?.slice(1)
  const FavoriteIcon = isFavorite[id] ? StarIcon : StarIconOutline
  const LikeIcon = isLike[id] ? HeartIcon : HeartIconOutline

  const handleFavorite = useCallback(async () => {
    setIsFavorite({ ...isFavorite, [id]: !isFavorite[id] })
    await axios.patch(
      `/api/contents/${isFavorite[id] ? 'unfavorite' : 'favorite'}`,
      {
        id
      }
    )
  }, [id])

  const handleLike = useCallback(async () => {
    setIsLike({ ...isLike, [id]: !isLike[id] })
    await axios.patch(`/api/contents/${isLike[id] ? 'unlike' : 'like'}`, {
      id
    })
  }, [id])

  const handleNoInterested = useCallback(async () => {
    // setNoInterested({ ...isNoInterested, [id]: !isNoInterested[id] })
    setNoInterested(id, !isNoInterested[id])
    await axios.patch(
      `/api/contents/${isNoInterested[id] ? 'interested' : 'nointerested'}`,
      {
        id
      }
    )
  }, [id])

  return (
    <div key={id}>
      <h2>
        <a target="_blank" href={originHref!}>{`${ix + 1}. ${t}`}</a>
      </h2>
      <Markdown>{content}</Markdown>
      <div className="flex justify-between">
        <div className="flex gap-3">
          <FavoriteIcon
            className="w-6 cursor-pointer"
            onClick={() =>
              // setIsFavorite({ ...isFavorite, [id]: !isFavorite[id] })
              handleFavorite()
            }
          />
          <LikeIcon
            className={clsx(
              'mt-[2px] w-6 cursor-pointer',
              isLike && 'text-red-500'
            )}
            onClick={() => {
              // setIsLike({ ...isLike, [id]: !isLike[id] })
              handleLike()
            }}
          />
        </div>
        <XMarkIcon
          className="mt-[2px] w-6 cursor-pointer"
          onClick={() => {
            // setNoInterested(id, !isNoInterested[id])
            handleNoInterested()
          }}
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
