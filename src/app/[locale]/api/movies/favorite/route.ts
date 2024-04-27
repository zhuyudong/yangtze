import { without } from 'lodash'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { serverAuth } from '@/lib/server-auth'
import { db } from '@/server/db'

async function handler(req: NextRequest) {
  try {
    if (req.method === 'POST') {
      const { currentUser } = await serverAuth()
      const { movieId } = await req.json()

      const existingMovie = await db.movie.findUnique({
        where: {
          id: movieId
        }
      })

      if (!existingMovie) {
        throw new Error('Invalid ID')
      }

      const user = currentUser
        ? await db.user.update({
            where: {
              email: currentUser.email || ''
            },
            data: {
              favoriteIds: {
                push: movieId
              }
            }
          })
        : null

      return NextResponse.json(user)
    }

    if (req.method === 'DELETE') {
      const { currentUser } = await serverAuth()

      const { movieId } = await req.json()

      const existingMovie = await db.movie.findUnique({
        where: {
          id: movieId
        }
      })

      if (!existingMovie) {
        throw new Error('Invalid ID')
      }

      const updatedFavoriteIds = without(
        currentUser?.favoriteIds || [],
        movieId
      )

      const updatedUser = currentUser
        ? await db.user.update({
            where: {
              email: currentUser.email || ''
            },
            data: {
              favoriteIds: updatedFavoriteIds
            }
          })
        : null

      return NextResponse.json(updatedUser)
    }

    return NextResponse.json(null, { status: 405 })
  } catch (error) {
    console.log(error)

    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as DELETE, handler as POST }
