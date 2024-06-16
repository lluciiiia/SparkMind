import { z } from 'zod';

export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  duration: z.number(),
  views: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Video = z.infer<typeof videoSchema>;
