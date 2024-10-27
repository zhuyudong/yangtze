 

'use client'

import type { HTMLAttributes, ReactElement } from 'react'
import { Children, Suspense, useMemo } from 'react'

import { CopyButton } from '@/components/copy-button'
import { Icons } from '@/components/icons'
import { StyleSwitcher } from '@/components/style-switcher'
import { ThemeWrapper } from '@/components/theme-wrapper'
// import { V0Button } from '@/components/v0-button'
import { useConfig } from '@/hooks'
import { Index, styles } from '@/lib/registry'
import { cn } from '@/lib/utils'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface ComponentPreviewProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  extractClassname?: boolean
  extractedClassNames?: string
  align?: 'center' | 'start' | 'end'
  description?: string
}

export function ComponentPreview({
  name,
  children,
  className,
  // extractClassname,
  // extractedClassNames,
  align = 'center',
  // description,
  ...props
}: ComponentPreviewProps) {
  const [config] = useConfig()
  const index = styles.findIndex(style => style.name === config.style)

  const Codes = Children.toArray(children) as ReactElement[]
  const Code = Codes[index]

  const Preview = useMemo(() => {
    const Component = Index[config.style][name]?.component

    if (!Component) {
      return (
        <p className="text-sm text-muted-foreground">
          Component{' '}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {name}
          </code>{' '}
          not found in registry.
        </p>
      )
    }

    return <Component />
  }, [name, config.style])

  const codeString = useMemo(() => {
    if (
      typeof Code?.props['data-rehype-pretty-code-fragment'] !== 'undefined'
    ) {
      const [Button] = Children.toArray(Code.props.children) as ReactElement[]
      return Button?.props?.value || Button?.props?.__rawString__ || null
    }
  }, [Code])

  return (
    <div
      className={cn('group relative my-4 flex flex-col space-y-2', className)}
      {...props}
    >
      <Tabs defaultValue="preview" className="relative mr-auto w-full">
        <div className="flex items-center justify-between pb-3">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="preview"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Code
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="preview" className="relative rounded-md border">
          <div className="flex items-center justify-between p-4">
            <StyleSwitcher />
            <div className="flex items-center gap-2">
              {/* {config.style === 'default' && description ? (
                <V0Button
                  block={{
                    code: codeString,
                    name,
                    style: config.style,
                    description
                  }}
                />
              ) : null} */}
              <CopyButton
                value={codeString}
                variant="outline"
                className="size-7 text-foreground opacity-100 hover:bg-muted hover:text-foreground [&_svg]:size-3.5"
              />
            </div>
          </div>
          <ThemeWrapper defaultTheme="zinc">
            <div
              className={cn(
                'preview flex min-h-[350px] w-full justify-center p-10',
                {
                  'items-center': align === 'center',
                  'items-start': align === 'start',
                  'items-end': align === 'end'
                }
              )}
            >
              <Suspense
                fallback={
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                    Loading...
                  </div>
                }
              >
                {Preview}
              </Suspense>
            </div>
          </ThemeWrapper>
        </TabsContent>
        <TabsContent value="code">
          <div className="flex flex-col space-y-4">
            <div className="w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
              {Code}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
