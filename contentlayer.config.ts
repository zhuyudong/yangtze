import { getHighlighter } from '@shikijs/compat' // loadTheme
import {
  defineDocumentType,
  defineNestedType,
  makeSource
} from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import type { LineElement } from 'rehype-pretty-code'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import { codeImport } from 'remark-code-import'
// import remarkGfm from 'remark-gfm'
import { bundledLanguages, bundledThemes } from 'shiki'
import { visit } from 'unist-util-visit'

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
      // TODO: rehypeComponent,
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
        // @ts-ignore
        rehypePrettyCode,
        {
          getHighlighter: async () => {
            return getHighlighter({
              langs: Object.keys(bundledLanguages),
              themes: Object.keys(bundledThemes)
            })
          },
          onVisitLine(node: LineElement) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node?.children?.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
          onVisitHighlightedLine(node: LineElement) {
            node.properties.className!.push('line--highlighted')
          },
          onVisitHighlightedWord(node: LineElement) {
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
