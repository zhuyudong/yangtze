import { without } from 'lodash'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'

import { logger } from '@/lib/Logger'
import { serverAuth } from '@/lib/server-auth'
import { db } from '@/server/db'

async function handler(req: NextRequest) {
  try {
    const t = await getTranslations('User')
    const { currentUser } = await serverAuth()

    if (!currentUser) {
      // throw new Error('Please sign in')
      return NextResponse.json(
        { message: t('please_sign_in') },
        { status: 401 }
      )
    }

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
      logger.info('User %s favorited content %s', currentUser.email, contentId)
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
      logger.info(
        'User %s unfavorited content %s',
        currentUser.email,
        contentId
      )
      return NextResponse.json({
        favoriteIds: updatedUser.favoriteIds,
        likes: updatedUser.likedIds,
        noInteresteds: updatedUser.noInterestedIds,
        contents: {
          [contentId]: updatedContent
        }
      })
    }

    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
  } catch (error) {
    console.log(error)
    logger.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

export { handler as DELETE, handler as POST }
