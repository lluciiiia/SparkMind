import puppeteer from 'puppeteer';
import { Api } from '.';
import { PONG } from '../constants';

export class Scraper<T = string> {
  private constructor(private readonly _url: T) {}

  public static make<T>(url: T): Scraper<T> {
    return new Scraper(url);
  }

  public static async run<T>(scraper: Scraper<T>): Promise<Json> {
    try {
      const apiInstance = Api.make(scraper._url as unknown as string);
      const ping = await apiInstance.get();
      try {
        const output = Api.make(PONG);
        const pong = await output.post(ping);
        return pong;
      } catch (error) {
        throw new Error(
          `Error posting to ${PONG}: ${error instanceof Error ? error.message : 'Internal server error'}`,
        );
      }
    } catch (error) {
      throw new Error(
        `Error scraping ${scraper._url}: ${error instanceof Error ? error.message : 'Internal server error'}`,
      );
    }
  }
}
