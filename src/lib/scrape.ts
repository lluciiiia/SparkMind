'use server';

import { userAgent } from '@/constants';
import type { InputSchema, OutputSchema } from '@/schema/scrape';
import { createClient } from '@/utils/supabase/server';
import ogs from 'open-graph-scraper';
import { v4 as uuidv4 } from 'uuid';

const studyGuidePrompt = (topic: string, websiteData: string): string => `
You are a helpful AI assistant creating a 
concise and informative study guide on the 
topic of "${topic}" using information extracted 
from the provided website content.

## Website Content:

\`\`\`
${websiteData} 
\`\`\`

## Study Guide Requirements:

* **Concise and Focused:**  Prioritize key 
concepts and essential information for 
understanding the topic. 
* **Organized Structure:** Divide the content 
into logical sections (e.g., Introduction, Key 
Concepts, Examples, Applications, Summary) 
using headings and subheadings.
* **Clear Language:** Use plain language and 
avoid jargon where possible.
* **Examples and Illustrations:** When 
applicable, include illustrative examples to 
aid understanding.

## Begin generating the study guide:
`;

const fetchDescriptionFromURL = async (url: string) => {
  const options = {
    url,
    fetchOptions: { headers: { 'user-agent': userAgent } },
  };

  try {
    const { result } = await ogs(options);
    return result.ogDescription || 'No description found';
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.message : 'An unknown error occurred'}`);
  }
};

const insertScraperOutput = async (textOutput: string, promptName: string, uuid: string) => {
  const supabase = createClient();

  const newOutput = {
    output_id: uuid,
    text_output: textOutput,
    created_at: new Date(),
    updated_at: new Date(),
    prompt_name: promptName,
  };

  const { data, error } = await supabase.from('scraper_output').insert(newOutput).select();

  if (error) {
    throw new Error('Error inserting scraper output : ' + error.message);
  }

  return data;
};

const fetchAllScrapes = async (query: string): Promise<OutputSchema[]> => {
  const supabaseServer = createClient();
  let data: OutputSchema[] = [];

  if (query) {
    const { data: queryData, error } = await supabaseServer
      .from('scraper_output')
      .select('*')
      .ilike('prompt_name', `%${query}%`);
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
      .ilike('prompt_name', `%${query}%`)
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

const deleteOutput = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from('scraper_output').delete().eq('output_id', id);
  if (error) throw new Error(error.message);
};

export {
  fetchAllScrapes,
  fetchRecentScrapes,
  fetchDescriptionFromURL,
  insertScraperOutput,
  studyGuidePrompt,
  deleteOutput,
};
