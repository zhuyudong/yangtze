 
 

import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { compare } from 'bcrypt'
import type { AuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'
import Credentials from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import FacebookProvider from 'next-auth/providers/facebook'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import type { Provider } from 'next-auth/providers/index'
import TwitterProvider from 'next-auth/providers/twitter'

import { logger } from '@/lib/logger'
import { db } from '@/server/db'

// NOTE: 已登陆用户 /api/current 1) jwt -> 2) session
/**
 * NOTE: 登录接口调用流程
 * 1 /api/auth/session
 * 2 /api/auth/providers
 * 3 /zh/api/auth/csrf Credentials.authorize -> callbacks.jwt -> events.signIn
 * 4 /api/auth/callback/credentials callbacks.jwt -> callbacks.session
 * 5 /zh/api/auth/session
 */
export const authOptions: AuthOptions = {
  providers: [
    // NOTE: signIn('github', { callbackUrl: '/' })
    process.env.GITHUB_ID &&
      process.env.GITHUB_SECRET &&
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      }),
    // NOTE: signIn('google', { callbackUrl: '/' })
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        httpOptions: {
          timeout: 50000
        }
      }),
    process.env.FACEBOOK_ID &&
      process.env.FACEBOOK_SECRET &&
      FacebookProvider({
        clientId: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET
      }),
    process.env.AUTH0_ID &&
      process.env.AUTH0_SECRET &&
      process.env.AUTH0_ISSUER &&
      Auth0Provider({
        clientId: process.env.AUTH0_ID,
        clientSecret: process.env.AUTH0_SECRET,
        issuer: process.env.AUTH0_ISSUER
      }),
    process.env.TWITTER_ID &&
      process.env.TWITTER_SECRET &&
      TwitterProvider({
        clientId: process.env.TWITTER_ID,
        clientSecret: process.env.TWITTER_SECRET
      }),
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      EmailProvider({
        // server: process.env.EMAIL_SERVER,
        server: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          }
        },
        from: process.env.SMTP_FROM
      }),
    Credentials({
      // NOTE: src/app/[locale]/(fullscreen)/auth/page.ts signIn('credentials', {})
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        // NOTE: 定义登录表单字段
        email: {
          label: 'Email',
          type: 'text'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      /**
        credentials // NOTE: providers > Credentials > credentials 中定义的登录表单字段 
        { email: string, password: string, redirect: string, callbackUrl: '/', csrfToken: string, json: 'true' }
       */
      async authorize(credentials, req) {
        // console.log(`--------providers > Credentials > authorize-------`)
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }
        const user = await db.user.findUnique({
          where: {
            email: credentials.email
          }
        })
        if (!user?.hashedPassword) {
          throw new Error('Email does not exist')
        }

        const isCorrectPassword = await compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isCorrectPassword) {
          throw new Error('Incorrect password')
        }
        // logger.info('User %s signed in', user.email)
        return user
      }
    })
  ].filter(Boolean) as Provider[],
  callbacks: {
    /**
     * 使用 google 方式登录 token: {name: string, email: string, sub: string, iat: number, exp: number, jti: string}
     * 使用 credentials 方式登录
     *    第 1 次 token: {name: string, email: string, sub: string, picture: string}
     *    第 2 次 token: {name: string, email: string, sub: string, picture: string, iat: number, exp: number, jti: string}
       session: undefined
     */
    jwt({ token, session }) {
      // console.log(`--------callbacks > jwt-------`)
      return token
    },
    /**
     * token: {name: string, email: string, sub: string, iat: number, exp: number, jti: string}
       session: {user: {name: 'string, email: string, image: string}, expires: string}
     */
    async session({ session, token, user }) {
      // console.log(`--------callbacks > session-------`)
      const existingUser = await db.user.findUnique({
        where: {
          email: session.user.email! || token.email!
        }
      })
      return {
        ...session,
        user: {
          ...session.user,
          id: existingUser?.id,
          role: existingUser?.role
          // planId: existingUser?.planId ?? null,
        }
      }
    }
    /**
     * url: string
     * baseUrl string
     */
    // async redirect({ url, baseUrl }) {
    //   return baseUrl
    // }
  },
  // https://next-auth.js.org/configuration/events
  events: {
    /**
     * 使用 credentials 方式登录，仅有 user 和 account
     * user 参见 prisma User 表结构
     * account: {providerAccountId:: string, type: 'credentials', provider: 'credentials'}
     * 使用 google 方式登录，有 user, account, isNewUser
     */
    signIn({ user, account, profile, isNewUser }) {
      // console.log(`--------events > signIn-------`)
      logger.info('User %s signed in', user.email)
      if (isNewUser) {
        logger.info('New user signed in: %s', user.email)
      }
    },
    createUser({ user }) {
      console.log(`--------events > createUser-------`, user)
    },
    updateUser({ user }) {
      // console.log(`--------events > updateUser-------`, user)
    },
    linkAccount({ user, account, profile }) {
      // console.log(`--------events > linkAccount-------`)
    },
    /**
     * token: {name: string, email: string, sub: string, iat: number, exp: number, jti: string}
     */
    signOut({ session, token }) {
      // console.log(`--------events > signOut-------`)
    }
  },
  pages: {
    signIn: '/auth'
  },
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(db as any),
  session: { strategy: 'jwt' },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET
  },
  secret: process.env.NEXTAUTH_SECRET
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
