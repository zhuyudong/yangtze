import type { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

import { serverAuth } from '@/libs/serverAuth'

export async function handler(req: NextApiRequest) {
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
