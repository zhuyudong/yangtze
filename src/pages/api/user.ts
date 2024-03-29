import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/libs/prisma'

// POST /api/user
// Required fields in body: name, email
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await prisma.user.create({
    data: {
      ...req.body
    }
  })
  return res.status(201).json(result)
}
