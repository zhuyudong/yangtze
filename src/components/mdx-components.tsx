'use client'

import Image from 'next/image'
import NLink from 'next/link'
import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactNode
} from 'react'

import { Button } from '@/components/button'
import { Callout } from '@/components/callout'
import { Code, CodeGroup, Pre } from '@/components/code'
import { CodeBlockWrapper } from '@/components/code-block-wrapper'
import { ComponentExample } from '@/components/component-example'
import { ComponentPreview } from '@/components/component-preview'
import { ComponentSource } from '@/components/component-source'
import { FrameworkDocs } from '@/components/framework-docs'
import { Heading } from '@/components/heading'
import { InfoIcon } from '@/components/icons/info-icon'
import { Prose } from '@/components/prose'
import { cn } from '@/lib/utils'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from './ui/accordion'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { AspectRatio } from './ui/aspect-ratio'
import {
  Tabs as STabs,
  TabsContent as STabsContent,
  TabsList as STabsList,
  TabsTrigger as STabsTrigger
} from './ui/tabs'

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  AspectRatio
}

export { Button, Code as code, CodeGroup, Pre as pre }

export const a = NLink

// NOTE: 供给阅读空间即 weekly-by-category 组件使用
export function wrapper({ children }: { children: ReactNode }) {
  return (
    <article className="flex h-full flex-col pb-10 pt-16">
      <Prose className="flex-auto">{children}</Prose>
      <footer className="mx-auto mt-16 w-full max-w-2xl lg:max-w-5xl">
        {/* <Feedback /> */}
      </footer>
    </article>
  )
}

export const h1 = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    className={cn(
      'font-heading mt-2 scroll-m-20 text-3xl font-bold',
      className
    )}
    {...props}
  />
)

export const h3 = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      'font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
      className
    )}
    {...props}
  />
)

export const h4 = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h4
    className={cn(
      'font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
      className
    )}
    {...props}
  />
)

export const h5 = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h5
    className={cn(
      'mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
      className
    )}
    {...props}
  />
)

export const h6 = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h6
    className={cn(
      'mt-8 scroll-m-20 text-base font-semibold tracking-tight',
      className
    )}
    {...props}
  />
)

export const h2 = function H2(
  props: Omit<ComponentPropsWithoutRef<typeof Heading>, 'level'>
) {
  return <Heading level={2} {...props} />
}

export const a_ = ({
  className,
  ...props
}: HTMLAttributes<HTMLAnchorElement>) => (
  <a
    className={cn('font-medium underline underline-offset-4', className)}
    {...props}
  />
)

export const p = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn(
      'leading-7 text-[13px] [&:not(:first-child)]:mt-6',
      className
    )}
    {...props}
  />
)

export const ol = ({
  className,
  ...props
}: HTMLAttributes<HTMLOListElement>) => (
  // ml-6
  <ol className={cn('my-6 list-decimal', className)} {...props} />
)

export const ul = ({
  className,
  ...props
}: HTMLAttributes<HTMLUListElement>) => (
  // ml-6
  <ul className={cn('my-6 list-disc', className)} {...props} />
)

export const li = ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
  <li className={cn('mt-2', className)} {...props} />
)
export const img = ({
  className,
  alt,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) => (
  <img className={cn('rounded-md', className)} alt={alt} {...props} />
)

export const hr = ({ ...props }: HTMLAttributes<HTMLHRElement>) => (
  <hr className="my-4 md:my-8" {...props} />
)

export const blockquote = ({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) => (
  <blockquote
    className={cn('mt-6 border-l-2 pl-6 italic', className)}
    {...props}
  />
)

export const table = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) => (
  <div className="my-6 w-full overflow-y-auto">
    <table className={cn('w-full', className)} {...props} />
  </div>
)

export const th = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
      className
    )}
    {...props}
  />
)

export const td = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={cn(
      'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
      className
    )}
    {...props}
  />
)

export const tr = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn('m-0 border-t p-0 even:bg-muted', className)} {...props} />
)

export const TabsContent = ({
  className,
  ...props
}: ComponentProps<typeof STabsContent>) => (
  <STabsContent
    className={cn(
      'relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-semibold',
      className
    )}
    {...props}
  />
)

export const TabsList = ({
  className,
  ...props
}: ComponentProps<typeof STabsList>) => (
  <STabsList
    className={cn(
      'w-full justify-start rounded-none border-b bg-transparent p-0',
      className
    )}
    {...props}
  />
)

export const Tabs = ({ className, ...props }: ComponentProps<typeof STabs>) => (
  <STabs className={cn('relative mt-6 w-full', className)} {...props} />
)

export const TabsTrigger = ({
  className,
  ...props
}: ComponentProps<typeof STabsTrigger>) => (
  <STabsTrigger
    className={cn(
      'relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none',
      className
    )}
    {...props}
  />
)

export const Steps = ({ ...props }) => (
  <div
    className="[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]"
    {...props}
  />
)

export const Step = ({ className, ...props }: ComponentProps<'h3'>) => (
  <h3
    className={cn(
      'font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
      className
    )}
    {...props}
  />
)

export const CodeBlockWrapper_ = ({ ...props }) => (
  <CodeBlockWrapper className="rounded-md border" {...props} />
)

export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 flex gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 leading-6 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-200 dark:[--tw-prose-links-hover:theme(colors.emerald.300)] dark:[--tw-prose-links:theme(colors.white)]">
      <InfoIcon className="mt-1 size-4 flex-none fill-emerald-500 stroke-white dark:fill-emerald-200/20 dark:stroke-emerald-200" />
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Row({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
      {children}
    </div>
  )
}

export function Col({
  children,
  sticky = false
}: {
  children: ReactNode
  sticky?: boolean
}) {
  return (
    <div
      className={cn(
        '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
        sticky && 'xl:sticky xl:top-24'
      )}
    >
      {children}
    </div>
  )
}

export function Properties({ children }: { children: ReactNode }) {
  return (
    <div className="my-6">
      <ul
        role="list"
        // NOTE: 复杂样式
        // .m-0 {margin: 0px;}
        // .max-w-\[calc\(theme\(maxWidth\.lg\)-theme\(spacing\.8\)\)\] {max-width: calc(33rem/* 528px */ - 2rem/* 32px */);}
        // .list-none {list-style-type: none;}
        // .divide-y > :not([hidden]) ~ :not([hidden]) {--tw-divide-y-reverse: 0; border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));border-bottom-width: calc(1px * var(--tw-divide-y-reverse));}
        // .divide-zinc-900\/5 > :not([hidden]) ~ :not([hidden]) {border-color: rgb(24 24 27 / 0.05);}
        // .dark\:divide-white\/5:where(.dark, .dark *) > :not([hidden]) ~ :not([hidden]) { border-color: rgb(255 255 255 / 0.05);}
        className="m-0 max-w-[calc(theme(maxWidth.lg)-theme(spacing.8))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5"
      >
        {children}
      </ul>
    </div>
  )
}

export function Property({
  name,
  children,
  type
}: {
  name: string
  children: ReactNode
  type?: string
}) {
  return (
    <li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
      <dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
        <dt className="sr-only">Name</dt>
        <dd>
          <code>{name}</code>
        </dd>
        {type && (
          <>
            <dt className="sr-only">Type</dt>
            <dd className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
              {type}
            </dd>
          </>
        )}
        <dt className="sr-only">Description</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </dd>
      </dl>
    </li>
  )
}

export function Details({ children }: { children: ReactNode }) {
  return <details className="p-2">{children}</details>
}

export function Summary({ children }: { children: ReactNode }) {
  return (
    <summary className="cursor-pointer rounded-sm bg-zinc-100 p-1 text-[14px] font-medium outline-none">
      {children}
    </summary>
  )
}

export const Link = ({ className, ...props }: ComponentProps<typeof NLink>) => (
  <NLink
    className={cn('font-medium underline underline-offset-4', className)}
    {...props}
  />
)

export const FrameworkDocs_ = ({
  className,
  ...props
}: ComponentProps<typeof FrameworkDocs>) => (
  <FrameworkDocs className={cn(className)} {...props} />
)

export const LinkedCard = ({
  className,
  ...props
}: ComponentProps<typeof Link>) => (
  <Link
    className={cn(
      'flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10',
      className
    )}
    {...props}
  />
)

export const components = {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertTitle,
  AlertDescription,
  h1,
  // h2,
  h2,
  h3,
  h4,
  h5,
  h6,
  a,
  p,
  ul,
  ol,
  li,
  blockquote,
  img,
  hr,
  table,
  tr,
  th,
  td,
  pre: Pre,
  code: Code,
  CodeGroup,
  Image,
  Callout,
  ComponentPreview,
  ComponentExample,
  ComponentSource,
  AspectRatio,
  CodeBlockWrapper: CodeBlockWrapper_,
  Step,
  Steps,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  FrameworkDocs: FrameworkDocs_,
  Link,
  LinkedCard,
  Button,
  Note,
  Row,
  Col,
  Properties,
  Property,
  Details,
  Summary
}
