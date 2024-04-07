/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/consistent-type-imports */
// Use type safe message keys with `next-intl`
// import { PrismaClient } from '@prisma/client'
import { type SearchOptions } from 'flexsearch'

// NOTE: 这里使用 declare global {} 来声明全局变量
declare global {
  namespace globalThis {
    // NOTE: 注意这里使用 var 而不是 let 或 const
    var prisma: import('@prisma/client').PrismaClient
    // or
    // var prisma: PrismaClient
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
