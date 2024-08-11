import { z } from 'zod';

export const scraperQueueItemSchema = z.object({
  id: z.string().uuid(),
  url: z.string(),
  startedAt: z.date(),
  finishedAt: z.date(),
  status: z.enum(['pending', 'scraping', 'done', 'error']),
});

export const scrapeSchema = z.object({
  flaggedDomain: z.boolean().refine((flaggedDomain) => flaggedDomain, {
    message: 'Flagged domain must be provided',
  }),
  containsCensored: z.boolean().refine((containsCensored) => containsCensored, {
    message: 'Contains censored must be provided',
  }),
  filteredTexts: z.array(z.string()),
});

export const inputSchema = z.union([
  z.object({
    user_id: z.string().uuid(),
    url: z.string().url({ message: 'Invalid URL' }),
    text: z.string(),
    created_at: z.date().refine((date) => date.getTime() > Date.now() - 1000 * 60 * 60 * 24 * 30, {
      message: 'Date must be within the last 30 days',
    }),
    updated_at: z.date().refine((date) => date.getTime() > Date.now() - 1000 * 60 * 60 * 24 * 30, {
      message: 'Date must be within the last 30 days',
    }),
  }),
  z.object({
    error: z.string().refine((error) => error.length > 0, {
      message: 'Error must be provided',
    }),
  }),
]);

export const outputSchema = z.object({
  output_id: z.string().uuid(),
  prompt_name: z.string().refine((prompt_name) => prompt_name.length > 0, {
    message: 'Prompt name must be provided',
  }),
  text_output: z.string().refine((text_output) => text_output.length > 0, {
    message: 'Text output must be provided',
  }),
  created_at: z.date().refine((date) => date.getTime() > Date.now() - 1000 * 60 * 60 * 24 * 30, {
    message: 'Date must be within the last 30 days',
  }),
  updated_at: z.date().refine((date) => date.getTime() > Date.now() - 1000 * 60 * 60 * 24 * 30, {
    message: 'Date must be within the last 30 days',
  }),
});

export type ScrapeSchema = z.infer<typeof scrapeSchema>;
export type InputSchema = z.infer<typeof inputSchema>;
export type OutputSchema = z.infer<typeof outputSchema>;
export type ScraperQueueItemType = z.infer<typeof scraperQueueItemSchema>;
