'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PING, PONG } from '@/constants';
import { usePersistedId } from '@/hooks';
import { fetchDescriptionFromURL } from '@/lib/scrape';
import type { InputSchema, ScrapeSchema, ScraperQueueItemType } from '@/schema/scrape';
import { createClient } from '@/utils/supabase/client';
import { Check, Copy, Globe, Loader2 } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { AiFrame } from './AiFrame';

export const Scraper = memo(() => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [websiteData, setWebsiteData] = useState('');
  const [topic, setTopic] = useState('No Topic');
  const [isCopied, setIsCopied] = useState(false);
  const { id: outputId, setPersistedId, clearId } = usePersistedId('output_id');

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValidURL(url)) {
        toast.error('Please enter a valid URL');
        return;
      }
      setIsLoading(true);
      clearId();
      try {
        const newInputId = uuidv4();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          throw new Error('Request timed out');
        }, 30000);

        try {
          const response = await fetch(`${PING}${encodeURIComponent(url)}`, {
            method: 'GET',
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(
              `HTTP error! status: ${response.status}, statusText: ${response.statusText}`,
            );
          }

          const data = (await response.json()) as ScrapeSchema;

          if (data && data.filteredTexts) {
            const websiteDataText = data.filteredTexts.join('\n');
            setWebsiteData(websiteDataText);

            const supabase = createClient();
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (userError) {
              throw new Error('Failed to get user data');
            }

            const userId = userData.user?.id;

            if (!userId) {
              throw new Error('User ID is missing');
            }

            const postResponse = await fetch(PONG, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                input_id: newInputId,
                user_id: userId,
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
                setPersistedId(newInputId);
              } else {
                throw new Error('Failed to save scraping results');
              }
            } else {
              throw new Error('Failed to save scraping results');
            }
          } else {
            throw new Error('Scraping was not successful or response is invalid');
          }
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error('Scraping error:', error);
        if (error instanceof Error && error.name === 'AbortError') {
          toast.error('Request timed out. Please try again.');
        } else {
          toast.error(
            `Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [url, clearId, setPersistedId],
  );

  const isValidURL = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value.trim());
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(websiteData)
      .then(() => {
        setIsCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((error) => {
        toast.error(`Failed to copy: ${error instanceof Error ? error.message : 'Unknown error'}`);
      });
  }, [websiteData]);

  return (
    <Card className="w-full max-w-3xl mx-auto my-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Web Scraper</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Globe className="text-gray-400" />
            <Input
              type="url"
              placeholder="Enter URL to scrape"
              value={url}
              onChange={handleChange}
              className="flex-grow"
              disabled={isLoading}
              autoComplete={`on`}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={!url || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping...
              </>
            ) : (
              'Scrape Website'
            )}
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">{topic}</h3>
          <Card>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {websiteData ? (
                <AiFrame topic={topic} websiteData={websiteData} isLoading={isLoading} />
              ) : (
                <p className="text-gray-500 italic">No content available.</p>
              )}
            </ScrollArea>
          </Card>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {websiteData ? `${websiteData.length} characters` : 'No content'}
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!websiteData}>
          {isCopied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
});

Scraper.displayName = 'Scraper';
