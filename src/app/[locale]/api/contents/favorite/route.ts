import { without } from 'lodash'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { serverAuth } from '@/lib/server-auth'
import { db } from '@/server/db'

async function handler(req: NextRequest) {
  try {
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
    if (req.method === 'POST') {
      const updatedUser = await db.user.update({
        where: {
          id: currentUser.id
        },
        data: {
          favoriteIds: {
            push: contentId
          }
        }
      })
      const updatedContent = await db.content.update({
        where: {
          id: contentId
        },
        data: {
          favorites: {
            increment: 1
          }
        }
      })
      return NextResponse.json({
        favoriteIds: updatedUser.favoriteIds,
        likes: updatedUser.likedIds,
        noInteresteds: updatedUser.noInterestedIds,
        contents: {
          [contentId]: updatedContent
        }
      })
    }

    if (req.method === 'DELETE') {
      const updatedFavoriteIds = without(currentUser.favoriteIds, contentId)

      const updatedUser = await db.user.update({
        where: {
          id: currentUser.id
        },
        data: {
          favoriteIds: updatedFavoriteIds
        }
      })
      const updatedContent = await db.content.update({
        where: {
          id: contentId
        },
        data: {
          favorites: {
            decrement: 1
          }
        }
      })
      return NextResponse.json({
        favoriteIds: updatedUser.favoriteIds,
        likes: updatedUser.likedIds,
        noInteresteds: updatedUser.noInterestedIds,
        contents: {
          [contentId]: updatedContent
        }
      })
    }

    return NextResponse.json(null, { status: 405 })
  } catch (error) {
    console.log(error)

    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as DELETE, handler as POST }
