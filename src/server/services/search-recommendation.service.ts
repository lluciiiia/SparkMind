import { SearchRecommendationSchema } from '@/server/schemas';
import { customsearch_v1 } from 'googleapis';

const API_KEY = (process.env.GOOGLE_SEARCH_API_KEY as string) || '';
const SEARCH_ENGINE_ID = (process.env.GOOGLE_SEARCH_ENGINE_ID as string) || '';
console.log('API_KEY:', API_KEY);
console.log('SEARCH_ENGINE_ID:', SEARCH_ENGINE_ID);

const customSearch = new customsearch_v1.Customsearch({
  key: API_KEY,
});

export const search = async (query: string) => {
  try {
    const res = await customSearch.cse.list({
      key: API_KEY,
      cx: SEARCH_ENGINE_ID,
      q: query,
    });
    const data = res.data;
    const result = SearchRecommendationSchema.parse({
      info: data.searchInformation,
      items: data.items?.map((d) => ({
        link: d.link,
        title: d.title,
        snippet: d.snippet,
        thumbnail:
          d.pagemap && d.pagemap.cse_thumbnail && d.pagemap.cse_thumbnail.length > 0
            ? {
                src: d.pagemap.cse_thumbnail[0].src,
                width: d.pagemap.cse_thumbnail[0].width,
                height: d.pagemap.cse_thumbnail[0].height,
              }
            : undefined,
      })),
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
