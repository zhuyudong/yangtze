import { without } from 'lodash'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { serverAuth } from '@/lib/server-auth'
import { db } from '@/server/db'

async function handler(req: NextRequest) {
  try {
    if (req.method === 'PATCH') {
      const { currentUser } = await serverAuth()
      const { contentId } = await req.json()

      const existingContent = await db.content.findUnique({
        where: {
          id: contentId
        }
      })

      if (!existingContent) {
        throw new Error('Invalid ID')
      }

      const user = await db.user.update({
        where: {
          email: currentUser.email || ''
        },
        data: {
          likedIds: {
            push: contentId
          }
        }
      })

      return NextResponse.json(user)
    }

    if (req.method === 'DELETE') {
      const { currentUser } = await serverAuth()

      const { contentId } = await req.json()

      const existingContent = await db.content.findUnique({
        where: {
          id: contentId
        }
      })

      if (!existingContent) {
        throw new Error('Invalid ID')
      }

      const updatedFavoriteIds = without(currentUser.likedIds, contentId)

      const updatedUser = await db.user.update({
        where: {
          email: currentUser.email || ''
        },
        data: {
          likedIds: updatedFavoriteIds
        }
      })

      return NextResponse.json(updatedUser)
    }

    return NextResponse.json(null, { status: 405 })
  } catch (error) {
    console.log(error)

    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as DELETE, handler as PATCH }
