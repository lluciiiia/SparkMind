'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PING, PONG } from '@/constants';
import { createAPIClient } from '@/lib';
import { InputSchema, ScrapeSchema, type ScraperQueueItemType, inputSchema, scrapeSchema } from '@/schema/scrape';
import { createClient } from '@/utils/supabase/client';
import type React from 'react';
import { memo, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { AiFrame } from './AiFrame';

import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { fetchDescriptionFromURL } from '@/lib/scrape';
import { debounce } from '@/utils';



export const Scraper: React.FC = memo(() => {
  const [scraper, setScraper] = useState<ScraperQueueItemType | null>(null);
  const [url, setUrl] = useState<string>('');
  const [websiteData, setWebsiteData] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [uuid, setUuid] = useState<string>('');

  useIsomorphicLayoutEffect(() => {
    if (!url || !isValidURL(url)) return;
    const fetchDescription = async () => {
      try {
        const description = await fetchDescriptionFromURL(url);
        setTopic(description);
      } catch (error) {
        console.error('Error fetching description:', error);
        setTopic('No description available');
      }
    };
    fetchDescription();
  }, [url]);

  const isValidURL = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const supabaseClient = createClient();

  const getUser = async () => {
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser();
    if (error) {
      toast.error('Failed to get user');
      return null;
    }
    return user?.id;
  };

  const processItem = async (item: ScraperQueueItemType): Promise<void> => {
    const newUuid = uuidv4();
    setUuid(newUuid);
    if (!url) {
      toast.error('Please enter a URL before scraping');
      return;
    }
    console.log('item', item);
    console.log('url', url);
    setScraper(item);
    const user_id = await getUser();
    console.log('user_id', user_id);
    if (!user_id) {
      toast.error('No user ID found. Please log in and try again.');
      return;
    }

    try {
      const response = await fetch(`${PING}${url}`, { method: 'GET' });
      console.log('response', response);
      const data = await response.json() as ScrapeSchema;
      console.log('data', data);
      if (data) {
        const updatedScraperItem: ScraperQueueItemType = {
          ...item,
          url,
          status: 'done',
          finishedAt: new Date(),
        };
        setScraper(updatedScraperItem);
        setWebsiteData(data.filteredTexts ? data.filteredTexts.join('\n') : '');
        console.log(`filteredTexts`, data.filteredTexts);
        console.log('websiteData', websiteData);
        const postResponse = await fetch(PONG, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input_id: newUuid,
            user_id,
            url,
            text: data.filteredTexts ? data.filteredTexts.join('\n') : '',
            created_at: new Date(),
            updated_at: new Date(),
          }),
        });
        console.log('postResponse', postResponse);
        if (postResponse.ok) {
          const postData = await postResponse.json() as Extract<InputSchema, { url: string, text: string, created_at: Date, updated_at: Date }>;

          if (postData) {
            toast.success('Scraping was successful');
          } else {
            toast.error('Failed to save scraping results');
          }
        } else {
          toast.error('Failed to save scraping results');
        }
      } else {
        throw new Error('Scraping was not successful or response is invalid');
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ScraperQueueItemType = {
      id: uuidv4(),
      url,
      startedAt: new Date(),
      finishedAt: new Date(),
      status: 'pending',
    };
    processItem(item);
  };
  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }, 500);

  return (
    <>
      <form className="flex flex-col gap-4">
        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="text"
            onChange={(e) => handleChange(e)}
            placeholder="Enter URL"
            className={scraper?.status === 'pending' ? 'cursor-not-allowed' : ''}
          />
        </div>
        <Button
          type="submit"
          className={`${
            !url || scraper?.status === 'pending'
              ? 'bg-gray-500 cursor-not-allowed opacity-50 pointer-events-none'
              : 'bg-blue-500 cursor-pointer opacity-100 pointer-events-auto'
          } text-white py-2 px-4 rounded text-lg font-bold border-none outline-none shadow-md transition-colors duration-300 flex items-center justify-center gap-2`}
          data-testid="scrape-all"
          disabled={!url || scraper?.status === 'pending'}
          onClick={(e) =>  handleSubmit(e)}
        >
          <span className="ml-2">Scrape website</span>
        </Button>
      </form>
      <AiFrame topic={topic} websiteData={websiteData} uuid={uuid} isLoading={scraper?.status === 'pending'} />
    </>
  );
});