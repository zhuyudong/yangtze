/* eslint-disable no-underscore-dangle */
import {
  defineDocumentType,
  // defineNestedType,
  makeSource
} from 'contentlayer/source-files'
// import rehypeAutolinkHeadings from 'rehype-autolink-headings'
// import rehypePrettyCode from 'rehype-pretty-code'
// import rehypeSlug from 'rehype-slug'

// const LinksProperties = defineNestedType(() => ({
//   name: 'LinksProperties',
//   fields: {
//     doc: {
//       type: 'string'
//     },
//     api: {
//       type: 'string'
//     }
//   }
// }))

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.md`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    author: { type: 'string', required: false },
    image: {
      type: 'string',
      required: false
    },
    description: { type: 'string', required: false },
    date: { type: 'date', required: false },
    published: {
      type: 'boolean',
      required: false,
      default: false
    },
    tags: {
      type: 'string',
      required: false
    }
    // links: {
    //   type: 'nested',
    //   of: LinksProperties
    // }
  },
  /** @type {import('contentlayer/source-files').ComputedFields} */
  computedFields: {
    slug: {
      type: 'string',
      resolve: post => `/${post._raw.flattenedPath}`
    },
    slugAsParams: {
      type: 'string',
      resolve: doc => {
        /**
         * e.g
         *  {
              sourceFilePath: 'blog/next-auth_tutorial.md',
              sourceFileName: 'next-auth_tutorial.md',
              sourceFileDir: 'blog',
              contentType: 'markdown',
              flattenedPath: 'blog/next-auth_tutorial'
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
    remarkPlugins: [],
    rehypePlugins: []
  }
})
