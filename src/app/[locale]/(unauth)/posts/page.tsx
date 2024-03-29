import { Post } from '@/components/Post'
import { prisma } from '@/libs/prisma'

export default async function Home() {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: { author: true }
  })

  return (
    <>
      {feed.map(post => (
        <div key={post.id}>
          <Post post={post} />
        </div>
      ))}
    </>
  )
}
