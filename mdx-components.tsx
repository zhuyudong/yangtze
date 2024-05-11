import { type MDXComponents } from 'mdx/types'

import * as mdxComponents from '@/components/mdx-components'

/**
 * NOTE: 可以在 MDXProvider 中使用自定义组件，或提前在 useMDXComponents 注入 mdxComponents
 * import Index from '@/app/index.mdx'
 * <MDXProvider
    components={components}
  >
    <Index />
  </MDXProvider>
 */
export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    ...mdxComponents
  }
}
