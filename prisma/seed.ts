// import { prisma } from '@/libs/prisma'
import { PrismaClient } from '@prisma/client'

import articles from './articles.json'
import excerpts from './excerpts.json'
import movies from './movies.json'
import news from './news.json'
import photos from './photos.json'
import quotations from './quotations.json'
import resources from './resources.json'
import technology_news from './technology-news.json'
import tools from './tools.json'

const prisma = global.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') global.prisma = prisma

const contents = [
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
  const exists = await prisma.movie.findMany({
    // where: {
    //   title: u.title
    // }
  })
  if (exists.length) {
    console.log(`Seeding skipped. Movies already exist.`)
  } else {
    for (const u of movies) {
      const movie = await prisma.movie.create({
        data: u
      })
      console.log(`Created movie with id: ${movie.id}`)
    }
  }
  const cs = await prisma.content.findMany()
  if (cs.length) {
    console.log(`Seeding skipped. Contents already exist.`)
  } else {
    for (let i = 0; i < contents.length; i++) {
      await prisma.content.create({
        data: contents[i]
      })
      console.log(`Created content ${i + 1}`)
    }
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
