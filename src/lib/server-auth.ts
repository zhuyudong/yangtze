import { getServerSession } from 'next-auth'

import { db } from '@/server/db'

import { authOptions } from './auth'

export const serverAuth = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error('Not signed in')
  }

  const currentUser = await db.user.findUnique({
    where: {
      email: session.user.email
    }
  })

  if (!currentUser) {
    throw new Error('Not signed in')
  }

  return { currentUser }
}
