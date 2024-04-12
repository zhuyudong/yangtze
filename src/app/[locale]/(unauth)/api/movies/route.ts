import { NextResponse } from 'next/server'

import { prisma } from '@/libs/prisma'
// import { serverAuth } from '@/libs/serverAuth'

async function handler(req: Request) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(null, { status: 405 })
    }

    // await serverAuth()

    const movies = await prisma.movie.findMany()
    return NextResponse.json(movies)
  } catch (error) {
    console.log({ error })
    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as GET }
