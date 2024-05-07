'use client'

import { useParams } from 'next/navigation'
import type { ChangeEvent, ReactNode } from 'react'
import { useTransition } from 'react'

import { cn } from '@/lib/utils'
import { usePathname, useRouter } from '@/navigation'

type Props = {
  children: ReactNode
  defaultValue: string
  label: string
}

export function LocaleSwitcherSelect({ children, defaultValue, label }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      )
    })
  }

  return (
    <label
      className={cn(
        'relative text-gray-400',
        isPending && 'transition-opacity [&:disabled]:opacity-30'
      )}
    >
      <p className="sr-only">{label}</p>
      <select
        className={cn(
          'inline-flex !appearance-none border-none bg-transparent py-2 pl-2 text-xs focus:border-none focus:bg-white',
          params.locale === 'en' ? 'pr-6' : 'pr-3'
        )}
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {children}
      </select>
      {/* <span className="pointer-events-none absolute right-2 top-[8px]">⌄</span> */}
    </label>
  )
}
