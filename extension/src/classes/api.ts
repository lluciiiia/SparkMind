import axios from 'axios';
import { Redacted } from '.';
import type { ScraperScrapeResultType } from '../schema';

type ApiUrl = Redacted<string>;

export class Api {
  private constructor(readonly baseURL: ApiUrl) {}

  public static make(baseURL: string) {
    return new Api(Redacted.make(baseURL));
  }

  public async get(): Promise<Json> {
    try {
      const response = await axios.get(this.baseURL as unknown as string);
      if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
      return response.data;
    } catch (error) {
      throw new Error(`${error instanceof Error ? error.message : 'Internal server error'}`);
    }
  }

  public async post(data: Json): Promise<Json> {
    try {
      const response = await axios.post(this.baseURL as unknown as string, data);
      if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
      return response.data;
    } catch (error) {
      throw new Error(`${error instanceof Error ? error.message : 'Internal server error'}`);
    }
  }

  public async echo(data: ScraperScrapeResultType): Promise<ScraperScrapeResultType> {
    return data;
  }
}
