import { NextResponse } from 'next/server'

import { serverAuth } from '@/lib/server-auth'
import { db } from '@/server/db'

async function handler(
  req: Request,
  context: { params: { locale: string; movieId: string } }
) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(null, { status: 405 })
    }

    await serverAuth()
    // https://egghead.io/lessons/next-js-create-a-dynamic-api-route-in-next-js-app-router-with-the-context-param
    const { movieId } = context.params

    if (typeof movieId !== 'string') {
      throw new Error('Invalid Id')
    }

    if (!movieId) {
      throw new Error('Missing Id')
    }

    const movies = await db.movie.findUnique({
      where: {
        id: movieId
      }
    })

    return NextResponse.json(movies)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as GET }
