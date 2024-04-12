import { NextResponse } from 'next/server'

import { prisma } from '@/libs/prisma'
// import { serverAuth } from '@/libs/serverAuth'

async function handler(
  req: Request,
  // eslint-disable-next-line unused-imports/no-unused-vars
  context: { params: { locale: string } }
) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(null, { status: 405 })
    }

    // await serverAuth()
    const match = /\?category=([a-zA-Z]+[\w]+)$/.exec(req.url!)
    const contents = await prisma.content.findMany({
      where: {
        category: match ? match[1] : undefined
      }
    })
    return NextResponse.json(contents)
  } catch (error) {
    console.log({ error })
    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as GET }
