// import { getHighlighter, loadTheme } from '@shikijs/compat'
import fs from 'fs'
import path from 'path'
import { bundledLanguages, bundledThemes, getHighlighter } from 'shiki'
import { visit } from 'unist-util-visit'

/**
 * @type {import('rehype-pretty-code').Options}
 * @see https://rehype-pretty.pages.dev/#Options
 */
export const rehypeCodePrettyOptions = {
  keepBackground: true,
  getHighlighter: async () => {
    // NOTE: 可以用 @shiki/compat 的异步 getHighlighter 函数
    return await getHighlighter({
      langs: Object.keys(bundledLanguages),
      themes: Object.keys(bundledThemes)
    })
  },
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and allow empty
    // lines to be copy/pasted
    if (node?.children?.length === 0) {
      node.children = [{ type: 'text', value: ' ' }]
    }
  },
  onVisitHighlightedLine(node) {
    if (node?.properties?.className) {
      node.properties.className.push('line--highlighted')
    } else {
      node.properties.className = ['line--highlighted']
    }
  },
  // eslint-disable-next-line unused-imports/no-unused-vars
  onVisitHighlightedChars(element, id) {
    if (element?.properties?.className) {
      element.properties.className.push('word--highlighted')
    } else {
      element.properties.className = ['word--highlighted']
    }
  }
  // onVisitHighlightedWord(node: LineElement) {
  //   node!.properties!.className = ['word--highlighted']
  // }
}

/**
 * @typedef {import('shiki').BundledLanguage} BundledLanguage
 * @typedef {import('shiki').BundledTheme} BundledTheme
 * @typedef {import('shiki').HighlighterGeneric<BundledLanguage, BundledTheme>} HighlighterGeneric
 */

// FIXME
/** @type {HighlighterGeneric<BundledLanguage, BundledTheme>} */
let highlighter

export function rehypeShiki() {
  // @ts-ignore
  return async tree => {
    highlighter =
      highlighter ??
      (await getHighlighter({
        langs: Object.keys(bundledLanguages),
        themes: Object.keys(bundledThemes)
      }))
    // @ts-ignore
    visit(tree, 'element', node => {
      if (node.tagName === 'pre' && node.children[0]?.tagName === 'code') {
        const codeNode = node.children[0]
        /**
         * ```tsx
           @import("src/components/tailwindui/Buttons/Button1.tsx")
           ```
           { type: 'text', value: '@import("src/components/tailwindui/Buttons/Button1.tsx")' }
         */
        const textNode = codeNode.children[0]
        // NOTE: 所有自定义导入都要相对于项目根目录
        /**
         * @import("src/components/tailwindui/Buttons/Button1.tsx")
         * fileMatch[2] src/components/tailwindui/Buttons/Button1.tsx
         * fileMatch[4] Button1
         * fileMatch[5] tsx
         */
        const fileMatch =
          /@import\(('|")([a-zA-Z\d-_[\]().]*\/([a-zA-Z\d-_[\]().]*\/)*([a-zA-Z\d-_[\]().]*)\.(tsx|ts|js|jsx|py|sh|sql|html|css|scss|sass|less|json|go))('|")\)/.exec(
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
}

export function rehypeCodeMeta() {
  return tree => {
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
  }
}

export function rehypeCodeRaw() {
  return tree => {
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
  }
}
