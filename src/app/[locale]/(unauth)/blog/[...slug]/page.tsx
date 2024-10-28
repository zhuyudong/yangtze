'use client'

import MDX from 'content/blog/mdx.mdx'
import NextAuth from 'content/blog/next-auth-tutorial.mdx'
import NextMDX from 'content/blog/next-mdx-tutorial.mdx'
import PythonEnvironment from 'content/blog/python-environment.mdx'
import { ChevronLeft } from 'lucide-react'
// import { type Metadata } from 'next'
// import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MDXProvider } from '@/components/mdx-provider'
import { buttonVariants } from '@/components/ui/button'
// import { env } from '@/env.mjs'
import { cn } from '@/lib/utils' // absoluteUrl, formatDate

interface PostPageProps {
  params: {
    slug: string
  }
}

const posts = [
  {
    title: 'next-auth 实践',
    description: '介绍 next-auth 支持的几种登录方式的使用。',
    slug: 'next-auth-tutorial',
    MDX: NextAuth
  },
  {
    title: '如何在 Next.js 中使用 mdx',
    description: '介绍了 @mdx-js/react 和 contentlayer 两种方式。',
    slug: 'next-mdx-tutorial',
    MDX: NextMDX
  },
  {
    title: 'Python 环境与依赖管理',
    description: '介绍 Python 几种环境和依赖管理方法的常见方式。',
    slug: 'python-environment',
    MDX: PythonEnvironment
  },
  {
    title: 'mdx 解析技术详解',
    description: 'mdx 解析相关技术栈详解，包括 remark、rehype、shiki 等。',
    slug: 'mdx',
    MDX
  }
]

export default function PostPage({ params }: PostPageProps) {
  const slug = params.slug[0]
  const post = posts.find(post => post.slug === slug)
  // const t = useTranslations('Blog')

  if (!post) {
    notFound()
  }

  return (
    <article className="container relative max-w-5xl py-6 lg:py-10">
      <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          '-ml-5 mb-3'
          // 'absolute left-[-200px] top-14 hidden xl:inline-flex'
        )}
      >
        <ChevronLeft className="mr-2 size-4" />
        {/* {t('see_all_posts')} */}
        See all posts
      </Link>
      <div>
        {/* {post.date && (
          <time
            dateTime={post.date}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDate(post.date)}
          </time>
        )} */}
        <h1 className="font-heading mt-2 inline-block text-3xl leading-tight lg:text-3xl">
          {post.title}
        </h1>
        <Link
          href="/blog"
          target="_blank"
          className="mt-4 flex items-center space-x-2 text-sm"
        >
          {/* <Image
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
          )} */}
        </Link>
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
      {/* <MdxContent code={post.body.code} /> */}
      <MDXProvider>
        <post.MDX />
      </MDXProvider>
      {/* <hr className="mt-12" /> */}

      {/* <div className="flex justify-center py-6 lg:py-10">
        <Link href="/blog" className={cn(buttonVariants({ variant: 'ghost' }))}>
          <ChevronLeft className="mr-2 size-4" />
          See all posts
        </Link>
      </div> */}
    </article>
  )
}
