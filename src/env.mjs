import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// Don't add NODE_ENV into T3 Env, it changes the tree-shaking behavior
export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string()
        : z.string().optional(),
    // NEXTAUTH_URL:
    //   process.env.NODE_ENV === 'production'
    //     ? z.preprocess(
    //         // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    //         // Since NextAuth.js automatically uses the VERCEL_URL if present.
    //         str => process.env.VERCEL_URL ?? str,
    //         // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    //         process.env.VERCEL ? z.string() : z.string().url()
    //       )
    //     : z.string().optional(),
    // OPENAI_API_KEY: z.string().optional(),
    GOOGLE_CLIENT_ID:
      process.env.NODE_ENV === 'production'
        ? z.string()
        : z.string().optional(),
    GOOGLE_CLIENT_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string()
        : z.string().optional(),
    // CLERK_SECRET_KEY: z.string().min(1),
    // DATABASE_URL: z.string().min(1),
    // DATABASE_AUTH_TOKEN: z.string().optional(),
    // MONGO_URL: z.string().min(1),
    LOGTAIL_SOURCE_TOKEN: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    YANGTZE_DEMO: z.string().optional()
  },
  client: {
    NEXT_PUBLIC_DEPLOYMENT_URL: z.string()
    // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1)
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_DEPLOYMENT_URL: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    YANGTZE_DEMO: process.env.YANGTZE_DEMO,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    // DATABASE_URL: process.env.DATABASE_URL,
    // DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
    // MONGO_URL: process.env.MONGO_URL,
    LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN
    // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true
})
