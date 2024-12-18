/* eslint-disable no-var */

// Use type safe message keys with `next-intl`
import { type Role } from '@prisma/client'
import type { PrismaClient } from '@prisma/client/edge'
import { type SearchOptions } from 'flexsearch'
import type { DefaultSession } from 'next-auth'

// import en from '../locales/en.json'
// type Messages = typeof en
// equivalent to
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type Messages = typeof import('../locales/en.json')

// NOTE: 这里使用 declare global {} 来声明全局变量
declare global {
  namespace globalThis {
    // NOTE: 注意这里使用 var 而不是 let 或 const
    // var prisma: import('@prisma/client/edge').PrismaClient
    // or
    var prisma: PrismaClient
  }

  interface IntlMessages extends Messages {}
}

declare interface IntlMessages extends Messages {}

declare module '@/mdx/search.mjs' {
  export interface Result {
    url: string
    title: string
    pageTitle?: string
  }

  export function search(query: string, options?: SearchOptions): Result[]
}

declare module '@/markdoc/search.mjs' {
  export interface Result {
    url: string
    title: string
    pageTitle?: string
  }

  export function search(query: string, options?: SearchOptions): Result[]
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
