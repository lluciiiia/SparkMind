'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PING, PONG } from '@/constants';
import { fetchDescriptionFromURL } from '@/lib/scrape';
import type { InputSchema, ScrapeSchema, ScraperQueueItemType } from '@/schema/scrape';
import { debounce } from '@/utils';
import { createClient } from '@/utils/supabase/client';
import type React from 'react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { AiFrame } from './AiFrame';

export const Scraper: React.FC = memo(() => {
  const [scraper, setScraper] = useState<ScraperQueueItemType | null>(null);
  const [url, setUrl] = useState<string>('');
  const [websiteData, setWebsiteData] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [uuid, setUuid] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetOutputId = useCallback(() => {
    sessionStorage.removeItem('output_id');
  }, []);

  useEffect(() => {
    const fetchDescription = async () => {
      if (!url || !isValidURL(url)) return;
      try {
        const description = await fetchDescriptionFromURL(url);
        setTopic(description);
      } catch (error) {
        console.error('Failed to fetch description:', error);
        setTopic('No description available');
      }
    };
    fetchDescription();
  }, [url]);

  const isValidURL = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getUser = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Failed to get user ID:', error);
      return null;
    }
    return data.user?.id;
  };

  const checkApiHealth = async () => {
    try {
      const removedQueryString = PING.split('?')[0].split('/scrape')[0];
      const response = await fetch(`${removedQueryString}/health`, { method: 'GET' });
      return response.ok;
    } catch {
      return false;
    }
  };

  const processItem = async (item: ScraperQueueItemType): Promise<void> => {
    if (!(await checkApiHealth())) {
      toast.error('Scraper API is currently unavailable. Please try again later.');
      return;
    }
    const newUuid = uuidv4();
    setUuid(newUuid);
    if (!url) {
      toast.error('Please enter a URL before scraping');
      return;
    }

    setScraper(item);
    setIsLoading(true);
    const user_id = await getUser();

    if (!user_id) {
      toast.error('No user ID found. Please log in and try again.');
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${PING}${encodeURIComponent(url)}`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, statusText: ${response.statusText}`,
        );
      }
      const data = (await response.json()) as ScrapeSchema;

      if (data && data.filteredTexts) {
        const updatedScraperItem: ScraperQueueItemType = {
          ...item,
          url,
          status: 'done',
          finishedAt: new Date(),
        };
        setScraper(updatedScraperItem);
        const websiteDataText = data.filteredTexts.join('\n');
        setWebsiteData(websiteDataText);

        const postResponse = await fetch(PONG, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input_id: newUuid,
            user_id,
            url,
            text: websiteDataText,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
        if (postResponse.ok) {
          const postData = (await postResponse.json()) as InputSchema;
          if (postData) {
            toast.success('Scraping was successful');
            sessionStorage.setItem('output_id', newUuid);
            window.history.pushState({}, '', `?output_id=${newUuid}`);
          } else {
            throw new Error('Failed to save scraping results');
          }
        } else {
          throw new Error('Failed to save scraping results');
        }
      } else {
        throw new Error('Scraping was not successful or response is invalid');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Scraping error:', error);
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          errorMessage =
            'Network error: Unable to connect to the scraper API. Please check your internet connection and try again.';
        }
      }
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidURL(url)) {
      toast.error('Please enter a valid URL');
      return;
    }
    resetOutputId();
    const item: ScraperQueueItemType = {
      id: uuidv4(),
      url,
      startedAt: new Date(),
      finishedAt: new Date(),
      status: 'pending',
    };
    processItem(item);
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debounce(() => setUrl(e.target.value.trim()), 300)();
  }, []);

  return (
    <>
      <form className="flex w-full max-w-sm items-center space-x-2" onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          id="url"
          type="url"
          onChange={handleChange}
          placeholder="Enter URL"
          className={`border rounded px-4 py-2 ${isLoading ? 'cursor-not-allowed' : ''}`}
          disabled={isLoading}
          required
        />
        <Button
          type="submit"
          className={`
            text-white transition-colors duration-300 flex items-center justify-center gap-2
            ${isLoading || !url ? 'bg-gray-500 cursor-not-allowed opacity-50' : 'bg-navy hover:bg-navy-dark'}
          `}
          data-testid="scrape-all"
          disabled={isLoading || !url}
          onClick={() => console.log('clicked')}
        >
          {isLoading ? 'Scraping...' : 'Scrape website'}
        </Button>
      </form>
      <AiFrame
        topic={topic}
        websiteData={websiteData}
        uuid={uuid}
        isLoading={isLoading}
        resetOutputId={resetOutputId}
      />
    </>
  );
});

Scraper.displayName = 'Scraper';
