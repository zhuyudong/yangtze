import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const marketingRouter = createTRPCRouter({
  subscribeToNewsletter: publicProcedure
    .input(z.object({ email: z.string().email() }))
    // eslint-disable-next-line unused-imports/no-unused-vars
    .mutation(async ({ input }) => {
      // TODD: email
    })
})
