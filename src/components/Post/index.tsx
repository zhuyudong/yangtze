'use client'

import type { Post as IPost, User } from '@prisma/client'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

import styles from './index.module.css'

export type PostProps = IPost & {
  author: User | null
}

export function Post({ post }: { post: PostProps }) {
  const authorName = post.author ? post.author.name : 'Unknown author'
  return (
    <Link href={`/post/${post.id}`} className={styles.post}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </Link>
  )
}
