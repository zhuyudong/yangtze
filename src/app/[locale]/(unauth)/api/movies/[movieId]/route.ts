import type { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

import { prisma } from '@/libs/prisma'
import { serverAuth } from '@/libs/serverAuth'

async function handler(req: NextApiRequest, context: any) {
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

    const movies = await prisma.movie.findUnique({
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
