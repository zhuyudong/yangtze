import { without } from 'lodash'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from 'next-auth/react'

import { db } from '@/server/db'

async function handler(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
      )
    }

    // const session = await getSession({ req });
    const session = await getSession()

    if (!session?.user?.email) {
      throw new Error('Not signed in')
    }

    const { movieId } = await req.json()

    const existingMovie = await db.movie.findUnique({
      where: {
        id: movieId
      }
    })

    if (!existingMovie) {
      throw new Error('Invalid ID')
    }

    const user = await db.user.findUnique({
      where: {
        email: session.user.email
      }
    })

    if (!user) {
      throw new Error('Invalid email')
    }

    const updatedFavoriteIds = without(user.favoriteIds, movieId)

    const updatedUser = await db.user.update({
      where: {
        email: session.user.email
      },
      data: {
        favoriteIds: updatedFavoriteIds
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.log(error)

    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as POST }
