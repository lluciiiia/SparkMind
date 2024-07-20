import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { search } from '@/server/services';
import { z } from 'zod';

export const searchRecommendationRouter = createTRPCRouter({
  get: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
    const result = await search(input.query);
    return result;
  }),
});
