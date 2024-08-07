import React from 'react';

import { Api, ScraperQueue } from '@src/classes';
import { Scraper } from '@src/components/scraper/component';
import { PONG } from '@src/constants';
import type { ScraperQueueItemType } from '@src/schema';
import supabase from '@src/supabase/supabase';
import { getCurrentUser } from '@src/utils/auth';
import Browser from 'webextension-polyfill';
import css from './styles.module.css';

export function Popup() {
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
        const apiInstance = Api.make(PONG);
        const response = await apiInstance.get();

        const updatedScraperItem: ScraperQueueItemType = {
          ...nextItem,
          status: 'done',
          finishedAt: new Date(),
          ...response,
        };

        scraperQueue.update(updatedScraperItem);
        setScraper(updatedScraperItem);

        await apiInstance.post(updatedScraperItem);
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

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (data?.url) {
      await Browser.runtime.sendMessage({
        action: 'signInWithGoogle',
        payload: { url: data.url },
      });
    }
  };

  React.useEffect(() => {
    try {
      Browser.runtime.sendMessage({ popupMounted: true });
    } catch (error) {
      console.error('Error in popup.tsx:', error);
      throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    processQueue();

    getCurrentUser().then((resp) => {
      if (resp) {
        console.log('user id:', resp.user.id);
      } else {
        console.log('user is not found');
      }
    });
  }, []);

  return (
    <div className={css.popupContainer}>
      <div className="mx-4 my-4">
        <button onClick={signInWithGoogle}>Sign In with Google</button>
        {scraper && <Scraper scraper={scraper} />}
        <hr />
      </div>
    </div>
  );
}
