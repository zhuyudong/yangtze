/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/consistent-type-imports */
// Use type safe message keys with `next-intl`
import { PrismaClient } from '@prisma/client'
import { type Role } from '@prisma/client'
import { type SearchOptions } from 'flexsearch'
import type { DefaultSession } from 'next-auth'

// NOTE: 这里使用 declare global {} 来声明全局变量
declare global {
  namespace globalThis {
    // NOTE: 注意这里使用 var 而不是 let 或 const
    // var prisma: import('@prisma/client').PrismaClient
    // or
    var prisma: PrismaClient
  }
}

type Messages = typeof import('../locales/en.json')
declare interface IntlMessages extends Messages {}

declare module '@/mdx/search.mjs' {
  export type Result = {
    url: string
    title: string
    pageTitle?: string
  }

  export function search(query: string, options?: SearchOptions): Array<Result>
}

declare module '@/markdoc/search.mjs' {
  export type Result = {
    url: string
    title: string
    pageTitle?: string
  }

  export function search(query: string, options?: SearchOptions): Array<Result>
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  // NOTE: 扩展 authOptions > callbacks > session 函数返回对象类型
  interface Session extends DefaultSession {
    user: {
      id: string
      role: Role
      // planId: string | null
    } & DefaultSession['user']
  }
}
