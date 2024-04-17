import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import { serverAuth } from '@/lib/server-auth'
import { db } from '@/server/db'

async function handler(req: NextRequest) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(null, { status: 405 })
    }

    // await serverAuth()

    const movies = await db.movie.findMany()
    return NextResponse.json(movies)
  } catch (error) {
    console.log({ error })
    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as GET }