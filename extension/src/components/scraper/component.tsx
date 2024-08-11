import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PING, PONG } from '../../constants';
import type { ScraperQueueItemType } from '../../schema';

export function Scraper() {
  const [scraper, setScraper] = React.useState<ScraperQueueItemType | null>(null);
  let censored = false;
  const processItem = async (item: ScraperQueueItemType): Promise<void> => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const url = tab.url;
    if (!url) {
      throw new Error('No tab URL found');
    }
    setScraper(item);
    fetch(`${PING}${url}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          if (data.containsCensored) {
            censored = true;
          }
          const updatedScraperItem: ScraperQueueItemType = {
            ...item,
            url,
            status: 'done',
            finishedAt: new Date(),
          };
          setScraper(updatedScraperItem);
          return fetch(PONG, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              input_id: item.id,
              url,
              text: data.filteredTexts ? data.filteredTexts.join('\n') : '',
            }),
          });
        } else {
          throw new Error('Scraping was not successful or response is invalid');
        }
      })
      .then((postResponse) => postResponse.json())
      .catch((error) => {
        throw new Error(`${error instanceof Error ? error.message : 'Internal server error'}`);
      });
  };
  return (
    <div className="flex h-full w-full mt-3 items-center justify-center mx-auto my-auto flex-col">
      <button
        style={{
          backgroundColor: scraper?.status === 'pending' ? 'gray' : 'blue',
          cursor: scraper?.status === 'pending' ? 'not-allowed' : 'pointer',
          color: scraper?.status === 'pending' ? 'white' : 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: 'bold',
          border: 'none',
          outline: 'none',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s ease',
          opacity: scraper?.status === 'pending' ? 0.5 : 1,
          pointerEvents: scraper?.status === 'pending' ? 'none' : 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
        data-testid="scrape-all"
        onClick={() => {
          const item: ScraperQueueItemType = {
            id: uuidv4(),
            url: window.location.href,
            startedAt: new Date(),
            finishedAt: new Date(),
            status: 'pending',
          };
          processItem(item);
        }}
        disabled={scraper?.status === 'pending'}
      >
        {<span className="ml-2">Scrape this website</span>}
      </button>
      {scraper?.status === 'pending' && <span className="ml-2">Pending...</span>}
      {scraper?.status === 'done' && <span className="ml-2">Done</span>}
      {scraper?.status === 'error' && <span className="ml-2">Error</span>}
      {censored && <span className="ml-2">This site contains censored content</span>}
    </div>
  );
}
