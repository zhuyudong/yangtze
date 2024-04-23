import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { serverAuth } from '@/lib/server-auth'
import { db } from '@/server/db'

async function handler(req: NextRequest) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(null, { status: 405 })
    }

    const { currentUser } = await serverAuth()

    const user = await db.user.findUnique({
      where: {
        id: currentUser?.id
      },
      select: {
        favoriteIds: true,
        likedIds: true,
        noInterestedIds: true
      }
    })

    const contents = (
      await db.content.findMany({
        select: {
          id: true,
          favorites: true,
          likes: true,
          noInteresteds: true
        }
      })
    ).reduce(
      (acc, cur) => {
        acc[cur.id] = {
          favorites: cur.favorites,
          likes: cur.likes,
          noInteresteds: cur.noInteresteds
        }
        return acc
      },
      {} as Record<
        string,
        { favorites: number; likes: number; noInteresteds: number }
      >
    )
    return NextResponse.json({
      favoriteIds: user?.favoriteIds || [],
      likedIds: user?.likedIds || [],
      noInterestedIds: user?.noInterestedIds || [],
      contents
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as GET }
