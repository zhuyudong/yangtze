import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

import { prisma } from '@/libs/prisma'

async function handler(req: Request) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json(null, { status: 405 })
    }

    const { email, name, password } = await req.json()

    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (existingUser) {
      // return res.status(422).json({ error: 'Email taken' });
      return NextResponse.json({ error: 'Email taken' }, { status: 422 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: '',
        emailVerified: new Date()
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    // return res.status(400).json({ error: `Something went wrong: ${error}` });
    return NextResponse.json({ error }, { status: 400 })
  }
}

export { handler as POST }
