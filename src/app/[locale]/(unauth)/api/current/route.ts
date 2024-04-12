import { NextResponse } from 'next/server'

import { serverAuth } from '@/libs/serverAuth'

async function handler(req: Request) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(null, { status: 405 })
    }

    const { currentUser } = await serverAuth()

    return NextResponse.json(currentUser)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as GET }
