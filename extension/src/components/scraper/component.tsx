import { Api, ScraperQueue } from '@src/classes';
import { Scraper as ScraperClass } from '@src/classes/scrape';
import { PONG } from '@src/constants';
import type { ScraperQueueItemType } from '@src/schema';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import css from './styles.module.css';

export function Scraper() {
  const [scraper, setScraper] = React.useState<ScraperQueueItemType | null>(null);

  const processQueue = async () => {
    const scraperQueue = ScraperQueue.make();

    while (true) {
      const nextItem = scraperQueue.next();
      if (!nextItem) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      setScraper(nextItem);

      try {
        const apiInstance = ScraperClass.make(window.location.href);
        const response = await apiInstance.run(apiInstance);

        console.log('response', response);

        const updatedScraperItem: ScraperQueueItemType = {
          ...nextItem,
          url: window.location.href,
          status: 'done',
          finishedAt: new Date(),
        };

        scraperQueue.update(updatedScraperItem);
        setScraper(updatedScraperItem);
        try {
          const postInstance = Api.make(PONG);
          await postInstance.post({
            input_id: nextItem.id,
            url: window.location.href,
            text: response.filteredTexts,
          });
        } catch (error) {
          console.error('Error during posting:', error);
        }
      } catch (error) {
        console.error('Error during scraping:', error);
        const errorScraperItem: ScraperQueueItemType = {
          ...nextItem,
          status: 'error',
          finishedAt: new Date(),
        };
        scraperQueue.update(errorScraperItem);
        setScraper(errorScraperItem);
      }
    }
  };

  useEffect(() => {
    if (scraper) {
      switch (scraper.status) {
        case 'pending':
          toast('Scraping is pending...');
          break;
        case 'done':
          toast.success('Scraping completed successfully!');
          break;
        case 'error':
          toast.error('An error occurred during scraping.');
          break;
      }
    }
  }, [scraper]);

  return (
    <div className="flex h-full w-full mt-3 items-center justify-center mx-auto my-auto">
      <button
        className={css.btn}
        data-testid="scrape-all"
        onClick={() => {
          processQueue();
        }}
        disabled={scraper?.status === 'pending'}
      >
        Scrape Website
        {scraper?.status === 'pending' && <span className="ml-2">Pending...</span>}
        {scraper?.status === 'done' && <span className="ml-2">Done</span>}
        {scraper?.status === 'error' && <span className="ml-2">Error</span>}
        {!scraper && <span className="ml-2">Scraper is not running</span>}
      </button>
    </div>
  );
}
