import type { ScraperScrapeResultType } from '@src/schema';
import { Api } from '.';

export class Scraper<T = string> {
  private constructor(private readonly _url: T) {}

  public static make<T>(url: T): Scraper<T> {
    return new Scraper(url);
  }

  public async run<T>(scraper: Scraper<T>): Promise<ScraperScrapeResultType> {
    try {
      const apiInstance = Api.make(scraper._url as unknown as string);
      const ping = await apiInstance.get();
      return ping;
    } catch (error) {
      throw new Error(
        `Error scraping ${scraper._url}: ${error instanceof Error ? error.message : 'Internal server error'}`,
      );
    }
  }
}
