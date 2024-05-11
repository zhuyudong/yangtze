import {
  transformerNotationDiff
  // ...
} from '@shikijs/transformers'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

export async function highlightCode(code: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      transformers: [
        transformerNotationDiff()
        // ...
      ]
    })
    .process(code)

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
