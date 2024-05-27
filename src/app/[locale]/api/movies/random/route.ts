import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { serverAuth } from '@/lib/server-auth'
import { db } from '@/server/db'

async function handler(req: NextRequest) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
      )
    }

    await serverAuth()

    const moviesCount = await db.movie.count()
    const randomIndex = Math.floor(Math.random() * moviesCount)

    const randomMovies = await db.movie.findMany({
      take: 1,
      skip: randomIndex,
      cacheStrategy: { ttl: 604800 }
    })

    return NextResponse.json(randomMovies[0])
  } catch (error) {
    console.log(error)

    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as GET }
