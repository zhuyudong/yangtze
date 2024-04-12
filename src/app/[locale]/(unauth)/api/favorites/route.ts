import { NextResponse } from 'next/server'

import { prisma } from '@/libs/prisma'
import { serverAuth } from '@/libs/serverAuth'

async function handler(req: Request) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(null, { status: 405 })
    }

    const { currentUser } = await serverAuth()

    const favoritedMovies = await prisma.movie.findMany({
      where: {
        id: {
          in: currentUser?.favoriteIds
        }
      }
    })

    return NextResponse.json(favoritedMovies)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as GET }
