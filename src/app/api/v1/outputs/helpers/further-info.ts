import { createClient } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';

import { SearchRecommendationSchema } from '@/schema';
import { customsearch_v1 } from 'googleapis';

const API_KEY = (process.env.GOOGLE_SEARCH_API_KEY as string) || '';
const SEARCH_ENGINE_ID = (process.env.GOOGLE_SEARCH_ENGINE_ID as string) || '';

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
    throw new Error('Error when search : ' + (error as Error).message);
  }
};

export const dynamic = 'force-dynamic';

export async function saveFurtherInfoOutput(query: string, myLearningId: string, output: any) {
  const response = await search(query);

  const supabase = createClient();

  if (!output) {
    const { data, error } = await supabase
      .from('outputs')
      .insert([{ learning_id: myLearningId, further_info: JSON.stringify(response.items) }])
      .select();

    if (error) {
      return NextResponse.json({ error: 'Error inserting further info output' }, { status: 500 });
    }
  } else {
    const { data, error } = await supabase
      .from('outputs')
      .update([{ further_info: JSON.stringify(response.items) }])
      .eq('learning_id', myLearningId);

    if (error) {
      return NextResponse.json({ error: 'Error updating further info output' }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 200, body: 'success' });
}
