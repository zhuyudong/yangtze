 
import type { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

import { serverAuth } from '@/lib/server-auth'
import { db } from '@/server/db'

async function handler(
  req: Request,
   
  context: { params: { locale: string } }
) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
      )
    }

    const { currentUser } = await serverAuth()
    // '/api/contents?category=article&skip=1&take=20&onlyFavorited=true&onlyLiked=true&hiddenNoInterested=true'
    const match =
      /\?category=([a-zA-Z]+[\w]+)(&page_number=(\d+))?(&page_size=(\d+))?(&onlyFavorited=(true|false))?(&onlyLiked=(true|false))?(&hiddenNoInterested=(true|false))?/.exec(
        req.url
      )
    const category = match?.[1] ?? undefined
    const page_number = match?.[3] ? parseInt(match[3], 10) : 1
    const page_size = match?.[5] ? parseInt(match[5], 10) : 20
    const skip = (page_number - 1) * page_size
    const take = page_size
    const onlyFavorited = match?.[7] === 'true'
    const onlyLiked = match?.[9] === 'true'
    const hiddenNoInterested = match?.[11] === 'true'
    let favoritedIds: string[] = []
    let likedIds: string[] = []
    let noInterestedIds: string[] = []
    if (currentUser) {
      if (onlyFavorited) {
        favoritedIds = currentUser.favoriteIds
      }
      if (onlyLiked) {
        likedIds = currentUser.likedIds
      }
      if (hiddenNoInterested) {
        noInterestedIds = currentUser.noInterestedIds
      }
    }
    const where: Prisma.ContentWhereInput = { category }
    if (favoritedIds.length || likedIds.length) {
      where.id = {
        in: [...new Set(favoritedIds.concat(likedIds))]
      }
    }
    if (noInterestedIds.length) {
      where.id = {
        not: {
          in: noInterestedIds
        }
      }
    }
    // console.log({
    //   skip,
    //   take,
    //   where
    // })
    const total = await db.content.count({
      where
    })
    const contents = await db.content.findMany({
      where,
      orderBy: [
        {
          weekly: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ],
      skip,
      take,
      cacheStrategy: { ttl: 604800 }
    })
    return NextResponse.json({
      data: contents,
      total,
      prev: page_number > 0 ? page_number - 1 : null,
      next: skip + take < total ? page_number + 1 : null
    })
  } catch (error) {
    console.log({ error })
    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as GET }
