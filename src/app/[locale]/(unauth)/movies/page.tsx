'use client'

import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { Billboard } from '@/components/Billboard'
import { InfoModal } from '@/components/InfoModal'
import { MovieList } from '@/components/MovieList'
import { useFavorites, useInfoModalStore, useMovieList } from '@/hooks'

const Home = () => {
  /**
   * session: { user: { name: string, email: string, image: string }, expires: string }
   * status: 'loading' | 'authenticated' | 'unauthenticated'
   */
  const { data: session } = useSession()
  if (!session) {
    redirect('/auth')
  }

  const { data: movies = [] } = useMovieList()
  const { data: favorites = [] } = useFavorites()
  const { isOpen, closeModal } = useInfoModalStore()

  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal} />
      {/* <Navbar /> */}
      <Billboard />
      <div className="pb-40">
        <MovieList title="Trending Now" data={movies} />
        <MovieList title="My List" data={favorites} />
      </div>
    </>
  )
}

export default Home
