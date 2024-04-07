/* eslint-disable import/no-mutable-exports */
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // NOTE: global.prisma 类型在 src/types/global.d.ts 中定义
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

// export default prisma
export { prisma }

// 等效于如下

// const globalForPrisma = global as unknown as { prisma: PrismaClient }

// export const prisma = globalForPrisma.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
