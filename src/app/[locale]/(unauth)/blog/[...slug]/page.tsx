import { allPosts } from 'contentlayer/generated'
import { ChevronLeft } from 'lucide-react'
import { type Metadata } from 'next'
// import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { buttonVariants } from '@/components/ui/button'
import { env } from '@/env.mjs'
import { absoluteUrl, cn, formatDate } from '@/lib/utils'

import MdxContent from './mdx-content'

interface PostPageProps {
  params: {
    slug: string[]
  }
}

async function getPostFromParams(params: PostPageProps['params']) {
  const slug = params?.slug?.join('/')
  const post = allPosts.find(post => post.slugAsParams === slug)

  if (!post) {
    null
  }

  return post
}

export async function generateMetadata({
  params
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params)

  if (!post) {
    return {}
  }

  const ogUrl = new URL(`${env.NEXT_PUBLIC_DEPLOYMENT_URL}/${post.image}`)

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: absoluteUrl(post.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    }
  }
}

export async function generateStaticParams(): Promise<
  PostPageProps['params'][]
> {
  return allPosts.map(post => ({
    slug: post.slugAsParams.split('/')
  }))
}

export default async function PostPage({ params }: PostPageProps) {
  // const t = useTranslations('Blog')
  const post = await getPostFromParams(params)
  if (!post) {
    notFound()
  }

  return (
    <article className="container relative max-w-7xl py-6 lg:py-10">
      <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          '-ml-6 mb-3'
          // 'absolute left-[-200px] top-14 hidden xl:inline-flex'
        )}
      >
        <ChevronLeft className="mr-2 size-4" />
        {/* {t('see_all_posts')} */}
        See all posts
      </Link>
      <div>
        {post.date && (
          <time
            dateTime={post.date}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDate(post.date)}
          </time>
        )}
        <h1 className="font-heading mt-2 inline-block text-3xl leading-tight lg:text-3xl">
          {post.title}
        </h1>
        {/* <Link
          href="/blog"
          target="_blank"
          className="mt-4 flex items-center space-x-2 text-sm"
        >
          <Image
            src="/images/avatar.jpeg"
            alt=""
            width={24}
            height={24}
            className="rounded-full bg-white"
          />
          {post?.author && (
            <div className="flex-1 text-left leading-tight">
              <p className="text-[12px] font-medium text-muted-foreground">
                {post.author}
              </p>
            </div>
          )}
        </Link> */}
      </div>
      {/* {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={1920}
          height={1080}
          className="my-8 rounded-sm border bg-muted transition-colors"
          priority
        />
      )} */}
      <MdxContent code={post.body.code} />
      {/* <hr className="mt-12" /> */}
      {/* <Newsletter /> */}

      {/* <div className="flex justify-center py-6 lg:py-10">
        <Link href="/blog" className={cn(buttonVariants({ variant: 'ghost' }))}>
          <ChevronLeft className="mr-2 size-4" />
          See all posts
        </Link>
      </div> */}
    </article>
  )
}
