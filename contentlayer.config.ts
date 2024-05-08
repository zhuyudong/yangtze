/* eslint-disable no-underscore-dangle */
import {
  defineDocumentType,
  defineNestedType,
  makeSource
} from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import { codeImport } from 'remark-code-import'

// import remarkGfm from 'remark-gfm'
import {
  rehypeCodeMeta,
  rehypeCodePrettyOptions,
  rehypeCodeRaw,
  rehypeShiki
} from './src/mdx/plugins.mjs'

// eslint-disable-next-line unused-imports/no-unused-vars
const LinksProperties = defineNestedType(() => ({
  name: 'LinksProperties',
  fields: {
    doc: {
      type: 'string'
    }
  }
}))

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.md`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    author: { type: 'string', required: false },
    image: {
      type: 'string',
      required: false
    },
    date: { type: 'date', required: false },
    published: {
      type: 'boolean',
      required: false,
      default: false
    },
    tags: {
      type: 'list',
      required: false,
      of: { type: 'string' }
    },
    /**
     * links:
         doc: https://xxx
     */
    // links: {
    //   type: 'nested',
    //   of: LinksProperties
    // }
    featured: {
      type: 'boolean',
      required: false,
      default: false
    },
    component: {
      type: 'boolean',
      required: false,
      default: false
    },
    toc: {
      type: 'boolean',
      required: false,
      default: true
    }
  },
  /** @type {import('contentlayer/source-files').ComputedFields} */
  computedFields: {
    slug: {
      type: 'string',
      resolve: post => {
        return `/${post._raw.flattenedPath}`
      }
    },
    slugAsParams: {
      type: 'string',
      resolve: doc => {
        /**
         * e.g
         *  {
              sourceFilePath: 'blog/xxx.md',
              sourceFileName: 'xxx.md',
              sourceFileDir: 'blog',
              contentType: 'markdown',
              flattenedPath: 'blog/xxx'
            }
         */
        return doc._raw.flattenedPath.split('/').slice(1).join('/')
      }
    }
  }
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Post],
  mdx: {
    // @ts-ignore
    remarkPlugins: [codeImport], // remarkGfm
    rehypePlugins: [
      rehypeSlug,
      // rehypeComponent,
      rehypeShiki,
      rehypeCodeMeta,
      [
        // @ts-ignore
        rehypePrettyCode,
        rehypeCodePrettyOptions
      ],
      rehypeCodeRaw,
      // TODO: rehypeNpmCommand,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section'
          }
        }
      ]
    ]
  }
})
