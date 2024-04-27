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

    const favoritedContentIds = (
      await db.content.findMany({
        where: {
          id: {
            in: currentUser?.favoriteIds
          }
        },
        select: {
          id: true
        },
        orderBy: {
          weekly: 'desc'
          // createdAt: 'desc'
        }
      })
    ).map(i => i.id)

    return NextResponse.json(favoritedContentIds)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as GET }
