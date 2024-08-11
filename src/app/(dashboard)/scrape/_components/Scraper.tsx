'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PING, PONG } from '@/constants';
import { createAPIClient } from '@/lib';
import { type ScraperQueueItemType, inputSchema, scrapeSchema } from '@/schema/scrape';
import { createClient } from '@/utils/supabase/client';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { AiFrame } from './AiFrame';

import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { fetchDescriptionFromURL } from '@/lib/scrape';



export const Scraper = () => {
  const [scraper, setScraper] = useState<ScraperQueueItemType | null>(null);
  const [url, setUrl] = useState<string>('');
  const [websiteData, setWebsiteData] = useState<string>('');
  const [topic, setTopic] = useState<string>('');

  useIsomorphicLayoutEffect(() => {
    if (!url) return;
    const fetchDescription = async () => {
      const description = await fetchDescriptionFromURL(url);
      setTopic(description);
    };
    fetchDescription();
  }, [url]);

  const { fetch } = createAPIClient();
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

  const processItem = async (item: ScraperQueueItemType) => {
    if (!url) {
      toast.error('No URL found');
      return;
    }
    setScraper(item);
    const user_id = await getUser();
    if (!user_id) {
      toast.error('No user ID found');
      return;
    }

    try {
      const response = await fetch(`${PING}${url}`, { method: 'GET' }, scrapeSchema);
      if (response.success) {
        const updatedScraperItem: ScraperQueueItemType = {
          ...item,
          url,
          status: 'done',
          finishedAt: new Date(),
        };
        setScraper(updatedScraperItem);
        setWebsiteData(response.data[0].filteredTexts.join('\n'));
        const postResponse = await fetch(
          PONG,
          {
            method: 'POST',
            body: JSON.stringify({
              user_id,
              url: url,
              text: response.data[0].filteredTexts.join('\n'),
              created_at: new Date(),
              updated_at: new Date(),
            }),
          },
          inputSchema,
        );

        if (postResponse.success) {
          toast.success('Scraping was successful');
        } else {
          toast.error('Scraping was not successful or response is invalid');
        }
      } else {
        toast.error('Scraping was not successful or response is invalid');
      }
    } catch (error) {
      toast.error(`${error instanceof Error ? error.message : 'Internal server error'}`);
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

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            className={scraper?.status === 'pending' ? 'cursor-not-allowed' : ''}
          />
        </div>
        <Button
          type="submit"
          className={`${
            scraper?.status === 'pending'
              ? 'bg-gray-500 cursor-not-allowed opacity-50 pointer-events-none'
              : 'bg-blue-500 cursor-pointer opacity-100 pointer-events-auto'
          } text-white py-2 px-4 rounded text-lg font-bold border-none outline-none shadow-md transition-colors duration-300 flex items-center justify-center gap-2`}
          data-testid="scrape-all"
          disabled={scraper?.status === 'pending'}
        >
          <span className="ml-2">Scrape website</span>
        </Button>
      </form>
      <AiFrame topic={topic} websiteData={websiteData} />
    </>
  );
};