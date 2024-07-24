import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { searchYouTube } from '@/server/services';

export const videoRecommendationRouter = createTRPCRouter({
  get: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
    const result = await searchYouTube(input.query);
    return result;
  }),
});
