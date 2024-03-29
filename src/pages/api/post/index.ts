import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/libs/prisma'

// POST /api/post
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content, authorEmail } = req.body
  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { email: authorEmail } }
    }
  })
  return res.status(201).json(result)
}
