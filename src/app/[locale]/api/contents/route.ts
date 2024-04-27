/* eslint-disable @typescript-eslint/naming-convention */
import { NextResponse } from 'next/server'

import { db } from '@/server/db'
// import { serverAuth } from '@/lib/server-auth'

async function handler(
  req: Request,
  // eslint-disable-next-line unused-imports/no-unused-vars
  context: { params: { locale: string } }
) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
      )
    }

    // await serverAuth()
    // '/api/contents?category=article&skip=1&take=20'
    const match =
      /\?category=([a-zA-Z]+[\w]+)(&page_number=(\d+))?(&page_size=(\d+))?/.exec(
        req.url!
      )
    const category = match?.[1] ?? undefined
    const total = await db.content.count({
      where: {
        category
      }
    })
    const page_number = match?.[3] ? parseInt(match[3], 10) : 1
    const page_size = match?.[5] ? parseInt(match[5], 10) : 20
    const skip = (page_number - 1) * page_size
    const take = page_size
    // console.log({ category, total, page_number, page_size, skip, take })
    const contents = await db.content.findMany({
      where: {
        category
      },
      orderBy: [
        {
          weekly: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ],
      skip,
      take
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
