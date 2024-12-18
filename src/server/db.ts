/* eslint-disable @typescript-eslint/no-namespace */

/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

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
//   db = new PrismaClient().$extends(withAccelerate())
// } else {
//   if (!global.prisma) {
//     global.db = new PrismaClient().$extends(withAccelerate())
//   }
//   db = global.db
// }

// const db = global.db || new PrismaClient().$extends(withAccelerate())
// if (process.env.NODE_ENV !== 'production') global.db = db

// export { db }

// equivalent to

// const globalForPrisma = global as unknown as { db: PrismaClient }

// export const db = globalForPrisma.db || new PrismaClient().$extends(withAccelerate())

// if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db

// equivalent to

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? [/* 'query', */ 'error', 'warn']
        : ['error']
  }).$extends(withAccelerate())

const globalForPrisma = globalThis as unknown as {
  db: ReturnType<typeof createPrismaClient> | undefined
}

export const db = globalForPrisma.db ?? createPrismaClient()

if (env.NODE_ENV !== 'production') globalForPrisma.db = db
