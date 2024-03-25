import clsx from 'clsx'
import type { ComponentPropsWithoutRef, ElementType } from 'react'

export function Prose<T extends ElementType = 'div'>({
  as,
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'> & {
  as?: T
  className?: string
}) {
  const Component = as ?? 'div'

  return (
    <Component
      className={clsx(
        className,
        'prose text-lg dark:prose-invert',
        // NOTE: prose max-width
        // `html :where(& > *)` is used to select all direct children without an increase in specificity like you'd get from just `& > *`
        // [html_:where(&>*)]:lg:mx-[calc(50%-min(50%,theme(maxWidth.lg)))] [html_:where(&>*)]:lg:max-w-3xl ->
        // [html_:where(&>*)]:lg:mx-auto [html_:where(&>*)]:lg:max-w-screen-lg
        '[html_:where(&>*)]:mx-auto [html_:where(&>*)]:max-w-2xl [html_:where(&>*)]:lg:mx-auto [html_:where(&>*)]:lg:max-w-screen-lg'
      )}
      {...props}
    />
  )
}
