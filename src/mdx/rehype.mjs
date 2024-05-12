import { toString } from 'mdast-util-to-string'
import { mdxAnnotations } from 'mdx-annotations'

import rehypeAutolinkHeadings from 'rehype-autolink-headings'
// import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'

import { getSections } from './get-sections.mjs'
import { rehypeAddMDXExports } from './rehype-add-mdx-exports.mjs'
import { rehypeParseCodeBlocks } from './rehype-parse-code-blocks.mjs'
// import { rehypePrettyCodeOptions } from './rehype-pretty-code.mjs'
import { rehypeShiki } from './rehype-shiki.mjs'
import { rehypeSlugify } from './rehype-slugify.mjs'

// NOTE: deprecated hast@1.0.0: Renamed to rehype

/**
 * @typedef {import('unified').Plugin} Plugin
 * @typedef {import('unist').Node} Node
 */

export const rehypePlugins = [
  mdxAnnotations.rehype,
  rehypeParseCodeBlocks,
  rehypeShiki,
  // TODO: [rehypePrettyCode, rehypePrettyCodeOptions],
  rehypeSlugify,
  rehypeSlug,
  [
    rehypeAddMDXExports,
    tree => ({
      sections: `[${getSections(tree).join()}]`
    })
  ],
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
