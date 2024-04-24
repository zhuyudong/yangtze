import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import { withValidation } from 'next-validations'
// import { z } from 'zod'
// import { serverAuth } from '@/lib/server-auth'
import { db } from '@/server/db'

// const schema = z.object({})

// const validate = withValidation({
//   schema,
//   type: 'Zod',
//   mode: 'body'
// })

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
// const vHandler = validate(handler)
// export { vHandler as GET }
