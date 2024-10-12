/* eslint-disable no-var */
/* eslint-disable vars-on-top */
// import { db } from '@/server/db'
import { PrismaClient } from '@prisma/client'

import articles from './articles.json'
import excerpts from './excerpts.json'
// NOTE: 影片已上传至 https://uploadthing.com/dashboard/qixt4k2w2s/files
import movies from './movies.json'
import news from './news.json'
import photos from './photos.json'
import quotations from './quotations.json'
import resources from './resources.json'
import technology_news from './technology-news.json'
import tools from './tools.json'

// NOTE: 这里使用 declare global {} 来声明全局变量
declare global {
  namespace globalThis {
    // NOTE: 注意这里使用 var 而不是 let 或 const
    // var prisma: import('@prisma/client/edge').PrismaClient
    // or
    var db: PrismaClient
  }
}

const db = global.db || new PrismaClient() //.$extends(withAccelerate())
if (process.env.NODE_ENV !== 'production') global.db = db

const weeklys = [
  ...news,
  ...articles,
  ...technology_news,
  ...tools,
  ...quotations,
  ...excerpts,
  ...photos,
  ...resources
]
/**
 * 配置:
 *   package.json {"prisma": {"seed": "ts-node prisma/seed.ts"}}
 *   tsconfig.json {"ts-node": {"compilerOptions": {"module": "commonjs"}}}
 * 生效命令: npx prisma db seed
 */
async function main() {
  console.log(`Start seeding ...`)
  const exists = await db.movie.findMany({
    // where: {
    //   title: u.title
    // }
    // cacheStrategy: { ttl: 604800 }
  })
  if (exists.length) {
    console.log(`Seeding skipped. Movies already exist.`)
  } else {
    for (const u of movies) {
      const movie = await db.movie.create({
        data: u
      })
      console.log(`Created movie with id: ${movie.id}`)
    }
  }
  const weeklyIndexs = (
    await db.content.findMany({
      distinct: ['weekly'],
      select: { weekly: true }
      // cacheStrategy: { ttl: 604800 }
    })
  )
    .map(c => c.weekly)
    .filter(Boolean)

  const contents = weeklys.filter(
    c => c.weekly && !weeklyIndexs.includes(c.weekly)
  )
  // 逐条创建，确保 created_at 重复，查询时根据 created_at 排序能够确保顺序
  for (let i = 0; i < contents.length; i++) {
    await db.content.create({
      data: contents[i]
    })
    console.log(`Created content ${i + 1}`)
  }
  // 批量创建，created_at 重复，查询时根据 created_at 排序不能确保顺序
  // if (contents.length) {
  //   await db.content.createMany({
  //     data: contents
  //   })
  //   console.log(`Created ${contents.length} contents`)
  // }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
