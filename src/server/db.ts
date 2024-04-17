/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable import/no-mutable-exports */
import { PrismaClient } from '@prisma/client'

import { env } from '@/env.mjs'
// NOTE: global.db 类型在 src/types/global.d.ts 中定义，使用 prisma db seed 时无法识别 global.prisma 类型，故此在此再次定义
declare global {
  namespace globalThis {
    // NOTE: 注意这里使用 var 而不是 let 或 const
    var db: PrismaClient
  }
}

// let db: PrismaClient

// if (process.env.NODE_ENV === 'production') {
//   db = new PrismaClient()
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient()
//   }
//   db = global.prisma
// }

// const db = global.prisma || new PrismaClient()
// if (process.env.NODE_ENV !== 'production') global.prisma = db

// export { db }

// equivalent to

// const globalForPrisma = global as unknown as { prisma: PrismaClient }

// export const db = globalForPrisma.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// equivalent to

const createPrismaClient = () =>
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db