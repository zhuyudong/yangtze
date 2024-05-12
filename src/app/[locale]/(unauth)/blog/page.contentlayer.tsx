// import { allPosts } from 'contentlayer/generated'
// import { compareDesc } from 'date-fns'
// import { ChevronLeft } from 'lucide-react'
// import Image from 'next/image'
// import Link from 'next/link'

// import { buttonVariants } from '@/components/ui/button'

export const metadata = {
  title: 'Blog'
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  // const posts = allPosts
  //   .filter(post => post.published)
  //   .sort((a, b) => {
  //     return a?.date && b?.date
  //       ? compareDesc(new Date(a.date), new Date(b.date))
  //       : 1
  //   })
  return (
    <div className="container relative max-w-5xl py-6 lg:py-10">
      {/* <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-[-200px] top-14 hidden xl:inline-flex'
        )}
      >
        <ChevronLeft className="mr-2 size-4" />
        Home
      </Link> */}
      {/* <b className="ml-4 text-lg text-red-400">
        TODO：本博客动态路由还存在若干问题，待修复，如遇阅读问题请谅解！
      </b> */}
      {/* {posts?.length ? (
        <div className="m-4 grid gap-4">
          {posts.map(post => (
            <article
              key={post.title}
              className="group flex overflow-hidden rounded-sm border bg-white" // shadow-lg transition duration-300 hover:scale-105
            >
              <Image
                className="rounded-sm border bg-muted transition-colors md:block md:w-1/5"
                width={96}
                height={54}
                quality={100}
                priority
                src={
                  post?.image ||
                  '/images/OHR.AyutthayaTemple_ZH-CN5996587937_1920x1080.webp'
                }
                alt={post.title}
              />
              <div className="flex flex-1 flex-col justify-between p-4 py-1">
                <h2 className="mb-1 text-lg font-semibold text-gray-900">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mb-3 text-ellipsis text-sm text-gray-700">
                    {post.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Image
                      src="/images/avatar.jpeg"
                      className="mr-4 size-6 rounded-full"
                      width={18}
                      height={18}
                      alt={post.title}
                    />
                    {post?.author && (
                      <div className="text-sm text-gray-900">{post.author}</div>
                    )}
                  </div>
                  {post.date && (
                    <div className="text-sm text-gray-500 text-muted-foreground">
                      {formatDate(post.date)}
                    </div>
                  )}
                </div>
              </div>
              <Link href={post.slug} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p>No posts published.</p>
      )} */}
      {/* <div className="flex justify-center py-6 lg:py-10">
        <Link href="/" className={cn(buttonVariants({ variant: 'ghost' }))}>
          <ChevronLeft className="mr-2 size-4" />
          Home
        </Link>
      </div> */}
    </div>
  )
}
