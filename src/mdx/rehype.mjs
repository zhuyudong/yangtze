import fs from 'fs'
import path from 'path'

import { slugifyWithCounter } from '@sindresorhus/slugify'
import * as acorn from 'acorn'
import { toString } from 'mdast-util-to-string'
import { mdxAnnotations } from 'mdx-annotations'
import { bundledLanguages, bundledThemes, getHighlighter } from 'shiki'
import { visit } from 'unist-util-visit'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypeShiki } from './plugins.mjs' // rehypeCodePrettyOptions
// NOTE: deprecated hast@1.0.0: Renamed to rehype

/**
 * @typedef {import('unified').Plugin} Plugin
 * @typedef {import('unist').Node} Node
 */

function rehypeParseCodeBlocks() {
  return tree => {
    visit(tree, 'element', (node, _nodeIndex, parentNode) => {
      if (node.tagName === 'code' && node.properties.className) {
        parentNode.properties.language = node.properties.className[0]?.replace(
          /^language-/,
          ''
        )
      }
    })
  }
}

function rehypeSlugify() {
  return tree => {
    let slugify = slugifyWithCounter()
    visit(tree, 'element', node => {
      if (node.tagName === 'h2' && !node.properties.id) {
        node.properties.id = slugify(toString(node))
      }
    })
  }
}

function rehypeAddMDXExports(getExports) {
  return tree => {
    let exports = Object.entries(getExports(tree))

    for (let [name, value] of exports) {
      for (let node of tree.children) {
        if (
          node.type === 'mdxjsEsm' &&
          new RegExp(`export\\s+const\\s+${name}\\s*=`).test(node.value)
        ) {
          return
        }
      }

      let exportStr = `export const ${name} = ${value}`

      tree.children.push({
        type: 'mdxjsEsm',
        value: exportStr,
        data: {
          estree: acorn.parse(exportStr, {
            sourceType: 'module',
            ecmaVersion: 'latest'
          })
        }
      })
    }
  }
}

function getSections(node) {
  let sections = []

  for (let child of node.children ?? []) {
    if (child.type === 'element' && child.tagName === 'h2') {
      sections.push(`{
        title: ${JSON.stringify(toString(child))},
        id: ${JSON.stringify(child.properties.id)},
        ...${child.properties.annotation}
      }`)
    } else if (child.children) {
      sections.push(...getSections(child))
    }
  }

  return sections
}

export const rehypePlugins = [
  mdxAnnotations.rehype,
  rehypeParseCodeBlocks,
  rehypeShiki,
  // [rehypePrettyCode, rehypeCodePrettyOptions],
  rehypeSlugify,
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
