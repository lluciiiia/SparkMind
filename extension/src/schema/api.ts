import { z } from 'zod';

export const scraperQueueItemSchema = z.object({
  id: z.string().uuid(),
  url: z.string(),
  startedAt: z.date(),
  finishedAt: z.date(),
  status: z.enum(['pending', 'scraping', 'done', 'error']),
});

export const apiSchema = z.object({
  baseURL: z.string(),
});

export const scraperScrapeResultSchema = z.object({
  flaggedDomain: z.boolean(),
  containsCensored: z.boolean(),
  filteredTexts: z.array(z.string()),
});

export const postInputSchema = z.object({
  // 🤪
  text: z.string().refine((text) => text.replace('***', '<censored>')),
});

export type ScraperScrapeResultType = z.infer<typeof scraperScrapeResultSchema>;
export type ApiType = z.infer<typeof apiSchema>;
export type PostInputType = z.infer<typeof postInputSchema>;
export type ScraperQueueItemType = z.infer<typeof scraperQueueItemSchema>;