---
title: Next.js mdx tutorial
description: Next.js mdx tutorial.
author: Yudong
date: 2024-04-17
published: true
image: '/images/OHR.AgueroSpain_ZH-CN9622864502_1920x1080.jpg&rf=LaDigue_1920x1080.jpg'
---

## 使用 mdx-components.tsx

> mdx-components.tsx

```tsx
import { type MDXComponents } from 'mdx/types'

import * as mdxComponents from '@/components/mdx-components'

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    ...mdxComponents
  }
}
```

> next.config.mjs

```js
import nextMDX from '@next/mdx'

import { recmaPlugins } from './src/mdx/recma.mjs'
import { rehypePlugins } from './src/mdx/rehype.mjs'
import { remarkPlugins } from './src/mdx/remark.mjs'
import withSearch from './src/mdx/search.mjs'

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins
  }
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx']
  //...
}

export default withSearch(withMDX(nextConfig))
```

## 使用 contentlayer【推荐】

> contentlayer.config.ts

```ts
/* eslint-disable no-underscore-dangle */
import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.md`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    image: {
      type: 'string',
      required: false
    },
    description: { type: 'string', required: false },
    date: { type: 'date', required: false },
    published: {
      type: 'boolean',
      required: true,
      default: false
    }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: post => `/${post._raw.flattenedPath}`
    },
    slugAsParams: {
      type: 'string',
      resolve: doc => doc._raw.flattenedPath.split('/').slice(1).join('/')
    }
  }
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Post],
  mdx: {
    rehypePlugins: [
      //...
    ]
  }
})
```

## 自定义 mdx 语法

开发或构建前处理特殊语法文件，即将引入的文件内容内联

```py
@import('snippets/print.py')
```
