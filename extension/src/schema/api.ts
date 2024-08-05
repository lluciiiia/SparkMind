import { z } from 'zod';

export const apiSchema = z.object({
  baseURL: z.string(),
});

export const scraperScrapeResultSchema = z.object({
  flaggedDomain: z.boolean(),
  containsCensored: z.boolean(),
  filteredTexts: z.array(z.string()),
});

export const postInputSchema = z.object({});

export type ScraperScrapeResultType = z.infer<typeof scraperScrapeResultSchema>;
export type ApiType = z.infer<typeof apiSchema>;
