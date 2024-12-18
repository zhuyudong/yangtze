import { mdxAnnotations } from 'mdx-annotations'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export const remarkPlugins = [
  mdxAnnotations.remark /**
   * NOTE: support for frontmatter in MDX files
   * ---
   * title: Hello, world!
   * ---
   */,
  remarkFrontmatter,
  remarkMdxFrontmatter,
  remarkGfm
]
