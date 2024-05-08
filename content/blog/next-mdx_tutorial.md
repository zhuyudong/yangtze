---
title: 如何在 Next.js 中使用 mdx
description: 介绍了 @mdx-js/react 和 contentlayer 两种方式。
author: Yudong
date: 2024-04-17
published: true
image: '/images/OHR.AgueroSpain_ZH-CN9622864502_1920x1080.jpg&rf=LaDigue_1920x1080.jpg'
---

## mdx 代码块语法示例

#### 普通文本

```txt
Would you like to use TypeScript (recommended)? no
```

#### 语法高亮

```bash
npx shadcn-ui@latest init
```

#### 单行高亮

```json {4} title="jsconfig.json"
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## mdx 语法解析与显示

### 方式 1： 使用 mdx-components.tsx

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

### 方式 2： 使用 contentlayer【推荐】

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

假如有 markdown 代码块如下，通过 `@import('...')` 这种方式引入代码块

````markdown
```py
@import('snippets/print.py')
```
````

由 [rehype](https://github.com/rehypejs/rehype) 插件来解析并自动注入对应的代码，具体代码如下

````ts
;() => async tree => {
  visit(tree, 'element', node => {
    if (node.tagName === 'pre' && node.children[0]?.tagName === 'code') {
      let codeNode = node.children[0]
      /**
         * ```tsx
           @import("src/components/tailwindui/Buttons/Button1.tsx")
           ```
           { type: 'text', value: '@import("src/components/tailwindui/Buttons/Button1.tsx")' }
         */
      let textNode = codeNode.children[0]
      // NOTE: 所有自定义导入都要相对于项目根目录
      /**
       * @import("src/components/tailwindui/Buttons/Button1.tsx")
       * fileMatch[2] src/components/tailwindui/Buttons/Button1.tsx
       * fileMatch[4] Button1
       * fileMatch[5] tsx
       */
      const fileMatch =
        /@import\(('|")([a-zA-Z\d-_\[\]\(\).]*\/([a-zA-Z\d-_\[\]\(\).]*\/)*([a-zA-Z\d-_\[\]\(\).]*)\.(tsx|ts|js|jsx|py|sh|sql|html|css|scss|sass|less|json|go))('|")\)/.exec(
          textNode.value
        )
      if (fileMatch?.[2] && fileMatch[2].startsWith('src/')) {
        const codePath = path.resolve(process.cwd(), `${fileMatch[2]}`)
        const actualCode = fs.readFileSync(codePath).toString()
        node.properties.code = actualCode
        textNode.value = actualCode
        // console.log(textNode, actualCode)
      } else {
        node.properties.code = textNode.value
      }

      if (node.properties.language) {
        const tokens = highlighter.codeToHtml(textNode.value, {
          lang: node.properties.language,
          // themes: {
          //   light: 'vitesse-light',
          //   dark: 'vitesse-dark'
          // }
          theme: 'slack-dark'
        })
        textNode.value = tokens
      }
    }
  })
}
````
