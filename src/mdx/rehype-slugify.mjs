// @ts-nocheck
import { slugifyWithCounter } from '@sindresorhus/slugify'
import { visit } from 'unist-util-visit'

export function rehypeSlugify() {
  return tree => {
    let slugify = slugifyWithCounter()
    visit(tree, 'element', node => {
      if (node.tagName === 'h2' && !node.properties.id) {
        node.properties.id = slugify(toString(node))
      }
    })
  }
}
