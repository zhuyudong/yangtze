import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'

import { aiRouter } from './routers/ai'
import { exampleRouter } from './routers/example'
import { marketingRouter } from './routers/marketing'
// import { paymentManagementRouter } from "./routers/payment-management";
import { superAdminRouter } from './routers/super-admin'
import { userRouter } from './routers/user'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  // paymentManagement: paymentManagementRouter,
  superAdmin: superAdminRouter,
  marketing: marketingRouter,
  user: userRouter,
  ai: aiRouter
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
