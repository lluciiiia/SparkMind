import { PING } from '@src/constants';
import { createAPIClient } from '@src/libs';
import type { ScraperQueueItemType, ScraperScrapeResultType } from '@src/schema';
import { scraperQueueItemSchema, scraperScrapeResultSchema } from '@src/schema';
import axios from 'axios';
import { Redacted } from '.';

type ApiUrl = Redacted<string>;

export class Api {
  private constructor(readonly baseURL: ApiUrl) {}

  public static make(baseURL: string) {
    return new Api(Redacted.make(baseURL));
  }

  public async get(): Promise<ScraperScrapeResultType> {
    const { fetch } = createAPIClient();
    try {
      const response = await fetch(
        `${PING}${this.baseURL as unknown as string}`,
        {
          method: 'GET',
        },
        scraperScrapeResultSchema,
      );
      return response;
    } catch (error) {
      throw new Error(`${error instanceof Error ? error.message : 'Internal server error'}`);
    }
  }

  public async post(data: { input_id: string; url: string; text: string[] }) {
    const { fetch } = createAPIClient();
    try {
      const response = await fetch(
        this.baseURL as unknown as string,
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
        scraperQueueItemSchema,
      );
      return response;
    } catch (error) {
      throw new Error(`${error instanceof Error ? error.message : 'Internal server error'}`);
    }
  }

  public async echo(data: ScraperScrapeResultType): Promise<ScraperScrapeResultType> {
    return data;
  }
}
