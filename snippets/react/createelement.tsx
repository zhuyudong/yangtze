import {
  createElement,
  type DetailedHTMLProps,
  type HTMLAttributes
} from 'react'

export function Heading({
  level,
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> & {
  level: 1 | 2 | 3 | 4 | 5 | 6
}) {
  const tag = `h${level}`
  return createElement(tag, props, <a href={`#${props.id}`}>{children}</a>)
}
