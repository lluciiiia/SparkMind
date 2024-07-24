import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { searchRecommendationRouter, videoRecommendationRouter, videoRouter } from './routers';

export const appRouter = createTRPCRouter({
  video: videoRouter,
  videoRecommendation: videoRecommendationRouter,
  searchRecommendation: searchRecommendationRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
