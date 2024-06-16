import { z } from 'zod';

export const SearchRecommendationSchema = z.object({
  info: z.object({
    totalResults: z.string(),
    searchTime: z.number(),
    formattedTotalResults: z.string(),
    formattedSearchTime: z.string(),
  }),
  items: z.array(
    z.object({
      link: z.string(),
      title: z.string(),
      snippet: z.string(),
      thumbnail: z
        .object({
          src: z.string(),
          width: z.string(),
          height: z.string(),
        })
        .optional(),
    })
  ),
});

export type SearchRecommendation = z.infer<typeof SearchRecommendationSchema>;
