import bcrypt from 'bcrypt'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { db } from '@/server/db'

async function handler(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
      )
    }

    const { email, name, password } = await req.json()

    const existingUser = await db.user.findUnique({
      where: {
        email
      }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email taken' }, { status: 422 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: ''
        // emailVerified: new Date()
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}

export { handler as POST }
