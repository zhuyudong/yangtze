import fs from 'fs'
import path from 'path'

import { slugifyWithCounter } from '@sindresorhus/slugify'
import * as acorn from 'acorn'
import { toString } from 'mdast-util-to-string'
import { mdxAnnotations } from 'mdx-annotations'
import { bundledLanguages, bundledThemes, getHighlighter } from 'shiki'
import { visit } from 'unist-util-visit'
// import rehypePrettyCode from 'rehype-pretty-code'

// NOTE: deprecated hast@1.0.0: Renamed to rehype

/**
 * @typedef {import('unified').Plugin} Plugin
 * @typedef {import('unist').Node} Node
 */

/**
 * @returns {Plugin}
 */
function rehypeParseCodeBlocks() {
  /**
   * @param {Plugin} tree
   */
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

let highlighter

/**
 *
 * @returns {Plugin}
 */
function rehypeShiki() {
  /**
   * @param {Plugin} tree
   */
  return async tree => {
    highlighter =
      highlighter ??
      (await getHighlighter({
        langs: Object.keys(bundledLanguages),
        themes: Object.keys(bundledThemes)
      }))
    /**
     * tree
     * {
          type: 'root',
          children: [
            { type: 'mdxjsEsm', value: '', data: [Object] },
            { type: 'text', value: '\n' },
            {
              type: 'element',
              tagName: 'h1',
              properties: {},
              children: [Array],
              position: [Object]
            }
          ],
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 16, column: 1, offset: 252 }
          }
        }
     * @param {Node} tree
     * node
     * {
          type: 'element',
          tagName: 'pre',
          properties: {
            language: 'tsx',
            code: '...'
          },
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: [Object],
              children: [Array],
              position: [Object]
            }
          ],
          position: {
            start: { line: 13, column: 1, offset: 217 },
            end: { line: 15, column: 4, offset: 251 }
          }
        }
     */
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
        // NOTE: 所有自定义导入都要相对于 src 目录
        /**
         * @import("src/components/tailwindui/Buttons/Button1.tsx")
         * fileMatch[2] src/components/tailwindui/Buttons/Button1.tsx
         * fileMatch[3] Button1
         * fileMatch[4] tsx
         */
        const fileMatch =
          /@import\(('|")([a-zA-Z\d-_\[\]\(\).]*\/([a-zA-Z\d-_\[\]\(\).]*\/)*([a-zA-Z\d-_\[\]\(\).]*)\.(tsx|ts|js|jsx|py|sh|sql|html|css|scss|sass|less|json|go))('|")\)/.exec(
            textNode.value
          )
        if (fileMatch?.[2]) {
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
}

/**
 * @returns {Plugin}
 */
function rehypeSlugify() {
  /**
   * @param {Plugin} tree
   */
  return tree => {
    let slugify = slugifyWithCounter()
    visit(tree, 'element', node => {
      if (node.tagName === 'h2' && !node.properties.id) {
        node.properties.id = slugify(toString(node))
      }
    })
  }
}

/**
 * @returns {Plugin}
 */
function rehypeAddMDXExports(getExports) {
  /**
   * @param {Plugin} tree
   */
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

/**
 * TODO
 * @param {*} node
 * @returns
 */
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

// https://rehype-pretty.pages.dev/
/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  // ...
}

export const rehypePlugins = [
  mdxAnnotations.rehype,
  // [rehypePrettyCode, rehypePrettyCodeOptions],
  rehypeParseCodeBlocks,
  rehypeShiki,
  rehypeSlugify,
  [
    rehypeAddMDXExports,
    tree => ({
      sections: `[${getSections(tree).join()}]`
    })
  ]
]
