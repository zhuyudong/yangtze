import { without } from 'lodash'
import { NextResponse } from 'next/server'

import { prisma } from '@/libs/prisma'
import { serverAuth } from '@/libs/serverAuth'

async function handler(req: Request) {
  try {
    if (req.method === 'POST') {
      const { currentUser } = await serverAuth()
      const { movieId } = await req.json()

      const existingMovie = await prisma.movie.findUnique({
        where: {
          id: movieId
        }
      })

      if (!existingMovie) {
        throw new Error('Invalid ID')
      }

      const user = await prisma.user.update({
        where: {
          email: currentUser.email || ''
        },
        data: {
          favoriteIds: {
            push: movieId
          }
        }
      })

      return NextResponse.json(user)
    }

    if (req.method === 'DELETE') {
      const { currentUser } = await serverAuth()

      const { movieId } = await req.json()

      const existingMovie = await prisma.movie.findUnique({
        where: {
          id: movieId
        }
      })

      if (!existingMovie) {
        throw new Error('Invalid ID')
      }

      const updatedFavoriteIds = without(currentUser.favoriteIds, movieId)

      const updatedUser = await prisma.user.update({
        where: {
          email: currentUser.email || ''
        },
        data: {
          favoriteIds: updatedFavoriteIds
        }
      })

      return NextResponse.json(updatedUser)
    }

    return NextResponse.json(null, { status: 405 })
  } catch (error) {
    console.log(error)

    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as DELETE, handler as POST }
