import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import { compare } from 'bcrypt'
import type { NextApiHandler } from 'next'
import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
// import Credentials from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import type { Provider } from 'next-auth/providers/index'

import { prisma } from '@/libs/prisma'
import redis from '@/libs/redis'

export async function storeAccessToken(accessToken: string, sub?: string) {
  if (!accessToken || !sub) return
  const expire = 30 // ONE_DAY * 30 // The number of seconds in 30 days
  await redis.set(accessToken, sub, { ex: expire })
}

export const authOptions: NextAuthOptions = {
  providers: [
    process.env.GITHUB_ID &&
      process.env.GITHUB_SECRET &&
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      }),
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }),
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      EmailProvider({
        server: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          }
        },
        from: process.env.SMTP_FROM
      })
    // Credentials({
    //   id: 'credentials',
    //   name: 'Credentials',
    //   credentials: {
    //     email: {
    //       label: 'Email',
    //       type: 'text'
    //     },
    //     password: {
    //       label: 'Password',
    //       type: 'passord'
    //     }
    //   },
    //   async authorize(credentials, req) {
    //     if (!credentials?.email || !credentials?.password) {
    //       throw new Error('Email and password required')
    //     }

    //     const user = await prisma.user.findUnique({
    //       where: {
    //         email: credentials.email
    //       }
    //     })

    //     if (!user || !user.hashedPassword) {
    //       throw new Error('Email does not exist')
    //     }

    //     const isCorrectPassword = await compare(
    //       credentials.password,
    //       user.hashedPassword
    //     )

    //     if (!isCorrectPassword) {
    //       throw new Error('Incorrect password')
    //     }

    //     return user
    //   }
    // })
  ].filter(Boolean) as Provider[],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout'
  },
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  secret: process.env.NEXTAUTH_SECRET
}

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, authOptions)

export default authHandler
