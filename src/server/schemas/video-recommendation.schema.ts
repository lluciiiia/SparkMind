import { z } from 'zod';

export const videoRecommendationSchema = z.object({
  videoId: z.string(),
  publishedAt: z.string(),
  channelId: z.string(),
  title: z.string(),
  description: z.string(),
  channelTitle: z.string(),
  liveBroadcastContent: z.string(),
  high: z.object({
    url: z.string(),
    height: z.number(),
    width: z.number(),
  }),
});

export type VideoRecommendation = z.infer<typeof videoRecommendationSchema>;
