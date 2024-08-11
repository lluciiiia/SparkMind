'use server';

import { userAgent } from '@/constants';
import type { InputSchema, OutputSchema } from '@/schema/scrape';
import ogs from 'open-graph-scraper';
import { createClient } from '@/utils/supabase/server';

const fetchDescriptionFromURL = async (url: string) => {
  const options = {
    url,
      fetchOptions: { headers: { 'user-agent': userAgent } }
    };

    try {
        const { result } = await ogs(options);
        return result.ogDescription || 'No description found';
      } catch (error) {
        throw new Error(`${error instanceof Error ? error.message : 'An unknown error occurred'}`);
      }
    };
const scrape = async (user_id: UUID): Promise<{ prompt_name: string; output: OutputSchema[] }> => {
  const supabaseServer = createClient();

  try {
    const { data: inputData, error: inputError } = await supabaseServer
      .from('scraper_input')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (inputError) throw new Error(`Error fetching scraper input: ${inputError.message}`);
    if (!inputData) throw new Error('No scraper input found for the user');

    const { data: outputData, error: outputError } = await supabaseServer
      .from('scraper_output')
      .select('*')
      .eq('prompt_name', inputData.prompt_name);

    if (outputError) throw new Error(`Error fetching scraper output: ${outputError.message}`);

    return {
      prompt_name: inputData.prompt_name,
      output: outputData || [],
    };
  } catch (error) {
    console.error('Error in scrape function:', error);
    throw error;
  }
};

const fetchAllScrapes = async (query: string): Promise<OutputSchema[]> => {
  const supabaseServer = createClient();
  let data: OutputSchema[] = [];

  if (query) {
    const { data: queryData, error } = await supabaseServer
      .from('scraper_output')
      .select('*')
      .eq('prompt_name', query);
    if (error) throw new Error(error.message);
    data = queryData || [];
  } else {
    const { data: allData, error } = await supabaseServer.from('scraper_output').select('*');
    if (error) throw new Error(error.message);
    data = allData || [];
  }

  return data;
};

const fetchRecentScrapes = async (query: string): Promise<OutputSchema[]> => {
  const supabaseServer = createClient();
  let data: OutputSchema[] = [];

  if (query) {
    const { data: queryData, error } = await supabaseServer
      .from('scraper_output')
      .select('*')
      .eq('prompt_name', query)
      .order('created_at', { ascending: false })
      .limit(5);
    if (error) throw new Error(error.message);
    data = queryData || [];
  } else {
    const { data: recentData, error } = await supabaseServer
      .from('scraper_output')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (error) throw new Error(error.message);
    data = recentData || [];
  }

  return data;
};

export { fetchAllScrapes, fetchRecentScrapes, scrape, fetchDescriptionFromURL };
