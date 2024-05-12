// https://shiki.style/packages/transformers#usage
// TODO: import rehypePrettyCode from 'rehype-pretty-code'
import rehypeShiki from '@shikijs/rehype'
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRenderWhitespace
  // ...
} from '@shikijs/transformers'
import { transformerTwoslash } from '@shikijs/twoslash'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
// import { getHighlighterCore } from 'shiki/core'
import { unified } from 'unified'

// NOTE: 自定义高亮 https://shiki.style/packages/rehype#fine-grained-bundle
// const highlighter = await getHighlighterCore({
//   themes: [import('shiki/themes/vitesse-light.mjs')],
//   langs: [import('shiki/langs/javascript.mjs')],
//   loadWasm: import('shiki/wasm')
// })

export async function highlightCode(code: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeShiki /* rehypePrettyCode */, {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark'
      },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationFocus(),
        transformerNotationErrorLevel(),
        transformerRenderWhitespace(),
        transformerMetaHighlight(),
        transformerMetaWordHighlight(),
        transformerTwoslash()
        // ...
      ]
    })
    .use(rehypeStringify)
    .process(code)
  // .process(await fs.readFile('./input.md'))

  return String(file)
}

/**
 * NOTE: for server components use
 * <Code code={code} />
 */
export async function Code({ code }: { code: string }) {
  const highlightedCode = await highlightCode(code)
  return (
    <section
      dangerouslySetInnerHTML={{
        __html: highlightedCode
      }}
    />
  )
}
