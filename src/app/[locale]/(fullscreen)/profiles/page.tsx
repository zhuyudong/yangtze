'use client'

import { redirect, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import type { FC } from 'react'
import { useCallback } from 'react'

import { useCurrentUser } from '@/hooks'

const images = [
  '/images/default-blue.png',
  '/images/default-red.png',
  '/images/default-slate.png',
  '/images/default-green.png'
]

interface UserCardProps {
  name: string
}

const UserCard: FC<UserCardProps> = ({ name }) => {
  const imgSrc = images[Math.floor(Math.random() * 4)]

  return (
    <div className="group mx-auto w-44 flex-row">
      <div className="flex size-44 items-center justify-center overflow-hidden rounded-md border-2 border-transparent group-hover:cursor-pointer group-hover:border-white">
        <img
          draggable={false}
          className="size-max object-contain"
          src={imgSrc}
          alt=""
        />
      </div>
      <div className="mt-4 text-center text-2xl text-gray-400 group-hover:text-white">
        {name}
      </div>
    </div>
  )
}

const App = () => {
  const { data: session } = useSession()
  if (!session) {
    redirect('/auth')
  }
  const router = useRouter()
  const { data: currentUser } = useCurrentUser()

  const selectProfile = useCallback(() => {
    router.push('/')
  }, [router])

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col">
        <h1 className="text-center text-3xl text-white md:text-6xl">
          Who&#39;s watching?
        </h1>
        <div className="mt-10 flex items-center justify-center gap-8">
          <div onClick={() => selectProfile()}>
            <UserCard name={currentUser!.name} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
