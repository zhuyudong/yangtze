import type { HTMLAttributes } from 'react'

import type { Event } from '@/lib/events'
import { cn } from '@/lib/utils'
import type { NpmCommands } from '@/types/unist'

import { CopyButton, CopyNpmCommandButton } from './copy-button'
import { StyleWrapper } from './style-wrapper'

export const h2 = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn(
      'font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0',
      className
    )}
    {...props}
  />
)

export const code = ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
  <code
    className={cn(
      'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
      className
    )}
    {...props}
  />
)

export const pre = ({
  className,
  __rawString__,
  __npmCommand__,
  __yarnCommand__,
  __pnpmCommand__,
  __bunCommand__,
  __withMeta__,
  __src__,
  __event__,
  __style__,
  ...props
}: HTMLAttributes<HTMLPreElement> & {
  __style__?: string // Style['name']
  __rawString__?: string
  __withMeta__?: boolean
  __src__?: string
  __event__?: Event['name']
} & NpmCommands) => {
  return (
    <StyleWrapper styleName={__style__}>
      <pre
        className={cn(
          'max-h-[650px] bg-[#222] p-4 overflow-x-auto text-xs', // !bg-transparent bg-zinc-950 py-4 dark:bg-zinc-900
          className
        )}
        {...props}
      />
      {__rawString__ && !__npmCommand__ && (
        <CopyButton
          value={__rawString__}
          src={__src__}
          event={__event__}
          className={cn('absolute right-4 top-4', __withMeta__ && 'top-16')}
        />
      )}
      {__npmCommand__ &&
        __yarnCommand__ &&
        __pnpmCommand__ &&
        __bunCommand__ && (
          <CopyNpmCommandButton
            commands={{
              __npmCommand__,
              __yarnCommand__,
              __pnpmCommand__,
              __bunCommand__
            }}
            className={cn('absolute right-4 top-4', __withMeta__ && 'top-16')}
          />
        )}
    </StyleWrapper>
  )
}
