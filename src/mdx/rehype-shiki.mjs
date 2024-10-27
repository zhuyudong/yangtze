// @ts-nocheck
import fs from 'fs'
import path from 'path'
import { bundledLanguages, bundledThemes, getHighlighter } from 'shiki'
import { visit } from 'unist-util-visit'
// import {
//   transformerMetaHighlight,
//   transformerMetaWordHighlight,
//   transformerNotationDiff,
//   transformerNotationErrorLevel,
//   transformerNotationFocus,
//   transformerNotationHighlight,
//   transformerNotationWordHighlight,
//   transformerRenderWhitespace
// } from '@shikijs/transformers'
// NOTE: https://shiki.style/packages/twoslash
// import { transformerTwoslash } from '@shikijs/twoslash'

/** @type {import('shiki').Highlighter} */
let highlighter

export function rehypeShiki() {
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
        // NOTE: 所有自定义导入都要相对于项目根目录
        /**
         * @import("src/components/tailwindui/Buttons/Button1.tsx")
         * fileMatch[2] src/components/tailwindui/Buttons/Button1.tsx
         * fileMatch[4] Button1
         * fileMatch[5] tsx
         */
        const fileMatch =
          // eslint-disable-next-line no-useless-escape
          /@import\(('|")([a-zA-Z\d-_\[\]\(\).]*\/([a-zA-Z\d-_\[\]\(\).]*\/)*([a-zA-Z\d-_\[\]\(\).]*)\.(tsx|ts|js|jsx|py|sh|sql|html|css|scss|sass|less|json|go))('|")\)/.exec(
            textNode.value
          )
        if (fileMatch?.[2]?.startsWith('src/')) {
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
            // },
            // NOTE: shiki 内置主题 https://shiki.style/themes
            theme: 'solarized-light',
            transformers: [
              // transformerNotationDiff(),
              // transformerNotationHighlight(),
              // transformerNotationWordHighlight(),
              // transformerNotationFocus(),
              // transformerNotationErrorLevel(),
              // transformerRenderWhitespace(),
              // transformerMetaHighlight(),
              // transformerMetaWordHighlight()
              // transformerTwoslash()
            ]
          })
          textNode.value = tokens
        }
      }
    })
  }
}
