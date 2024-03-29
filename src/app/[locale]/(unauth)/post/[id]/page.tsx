import { notFound } from 'next/navigation'
import React from 'react'

import { PostDetails } from '@/components/Post/PostDetails'
import { prisma } from '@/libs/prisma'

export default async function Post({ params }: { params: { id: string } }) {
  const id = Number(Array.isArray(params?.id) ? params?.id[0] : params?.id)
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true }
  })

  if (!post) notFound()

  return <PostDetails {...post} />
}
