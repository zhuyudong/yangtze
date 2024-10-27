 
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import { serverAuth } from '@/lib/server-auth'
import { db } from '@/server/db'

async function handler(req: NextRequest) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
      )
    }

    // const { currentUser } = await serverAuth()
    // TODO
    // const match = /\?category=([a-zA-Z]+[\w]+)(&page_number=(\d+))?(&page_size=(\d+))?/.exec(req.url!)
    // const category = match?.[1] ?? undefined
    // const page_number = match?.[3] ? parseInt(match[3], 10) : 1
    // const page_size = match?.[5] ? parseInt(match[5], 10) : 20
    // const skip = (page_number - 1) * page_size
    // const take = page_size

    // const user = currentUser
    //   ? await db.user.findUnique({
    //       where: {
    //         id: currentUser?.id
    //       },
    //       select: {
    //         favoriteIds: true,
    //         likedIds: true,
    //         noInterestedIds: true
    //       }
    //     })
    //   : { favoriteIds: [], likedIds: [], noInterestedIds: [] }

    const contents = (
      await db.content.findMany({
        // where: {
        //   category
        // },
        select: {
          id: true,
          favorites: true,
          likes: true,
          noInteresteds: true
        },
        orderBy: [
          {
            weekly: 'desc'
          },
          {
            createdAt: 'desc'
          }
        ],
        // skip,
        // take
        cacheStrategy: { ttl: 604800 }
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
    return NextResponse.json(contents)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as GET }
