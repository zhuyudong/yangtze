/* eslint-disable no-underscore-dangle */
// import { getHighlighter, loadTheme } from '@shikijs/compat'
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
import { visit } from 'unist-util-visit'

import type { UnistNode } from '@/types/unist'

import { rehypeComponent } from './lib/rehype-component'
import { rehypeNpmCommand } from './lib/rehype-npm-command'

// eslint-disable-next-line unused-imports/no-unused-vars
const LinksProperties = defineNestedType(() => ({
  name: 'LinksProperties',
  fields: {
    doc: {
      type: 'string'
    },
    api: {
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
    },
    // links: {
    //   type: 'nested',
    //   of: LinksProperties
    // }
    featured: {
      type: 'boolean',
      default: false,
      required: false
    },
    component: {
      type: 'boolean',
      default: false,
      required: false
    },
    toc: {
      type: 'boolean',
      default: true,
      required: false
    }
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
    // @ts-ignore
    remarkPlugins: [codeImport], // remarkGfm
    rehypePlugins: [
      rehypeSlug,
      rehypeComponent,
      () => tree => {
        visit(tree, node => {
          if (node?.type === 'element' && node?.tagName === 'pre') {
            const [codeEl] = node.children
            if (codeEl.tagName !== 'code') {
              return
            }
            if (codeEl.data?.meta) {
              // Extract event from meta and pass it down the tree.
              const regex = /event="([^"]*)"/
              const match = codeEl.data?.meta.match(regex)
              if (match) {
                node.__event__ = match ? match[1] : null
                codeEl.data.meta = codeEl.data.meta.replace(regex, '')
              }
            }
            node.__rawString__ = codeEl.children?.[0].value
            node.__src__ = node.properties?.__src__
            node.__style__ = node.properties?.__style__
          }
        })
      },
      [
        // @ts-expect-error
        rehypePrettyCode,
        {
          // TODO
          getHighlighter: async () => {
            // const theme = await loadTheme(
            //   path.join(process.cwd(), 'src/lib/themes/dark.json')
            // )
            // return getHighlighter({ theme })
          },
          onVisitLine(node: UnistNode) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node?.children?.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
          onVisitHighlightedLine(node: UnistNode) {
            // @ts-expect-error
            node.properties.className.push('line--highlighted')
          },
          onVisitHighlightedWord(node: UnistNode) {
            // @ts-expect-error
            node.properties.className = ['word--highlighted']
          }
        }
      ],
      () => tree => {
        visit(tree, node => {
          if (node?.type === 'element' && node?.tagName === 'div') {
            if (!('data-rehype-pretty-code-fragment' in node.properties)) {
              return
            }
            const preElement = node.children.at(-1)
            if (preElement.tagName !== 'pre') {
              return
            }
            preElement.properties.__withMeta__ =
              node.children.at(0).tagName === 'div'
            preElement.properties.__rawString__ = node.__rawString__
            if (node.__src__) {
              preElement.properties.__src__ = node.__src__
            }
            if (node.__event__) {
              preElement.properties.__event__ = node.__event__
            }
            if (node.__style__) {
              preElement.properties.__style__ = node.__style__
            }
          }
        })
      },
      rehypeNpmCommand,
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
