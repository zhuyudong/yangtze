import type { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

import { prisma } from '@/libs/prisma'
import { serverAuth } from '@/libs/serverAuth'

export async function handler(req: NextApiRequest) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(null, { status: 405 })
    }

    await serverAuth()

    const moviesCount = await prisma.movie.count()
    const randomIndex = Math.floor(Math.random() * moviesCount)

    const randomMovies = await prisma.movie.findMany({
      take: 1,
      skip: randomIndex
    })

    return NextResponse.json(randomMovies[0])
  } catch (error) {
    console.log(error)

    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as GET }
