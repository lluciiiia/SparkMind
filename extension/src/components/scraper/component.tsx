import { Scraper as ScraperClass } from '@src/classes/scrape';
import type { ScraperQueueItemType } from '@src/schema';
import React from 'react';
import { toast } from 'sonner';
import css from './styles.module.css';

// // // //

export function Scraper(props: {
  scraper: ScraperQueueItemType;
}) {
  React.useEffect(() => {
    if (props.scraper.status === 'pending') {
      toast('Scraping is pending...');
    } else if (props.scraper.status === 'done') {
      toast.success('Scraping completed successfully!');
    } else if (props.scraper.status === 'error') {
      toast.error('An error occurred during scraping.');
    }
  }, [props.scraper.status]);
  return (
    <div className="flex h-full w-full mt-3 items-center justify-center mx-auto my-auto">
      <button
        className={css.btn}
        data-testid="scrape-all"
        onClick={() => ScraperClass.make(props.scraper.url)}
        disabled={props.scraper.status === 'pending'}
      >
        Scrape Website
      </button>
    </div>
  );
}
