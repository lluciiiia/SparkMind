import type { ScraperScrapeResult } from '@src/types'
import axios from 'axios'
import { Redacted } from '.'


export class Api {
  
  private constructor(readonly baseURL: string) {}

  public static make(baseURL: string) {
    return new Api(baseURL)
  }

  public async get() {
    try {
      const scraperAPI = new Redacted().
      const response = await axios.get()
      if (response.status !== 200)
        throw new Error(`HTTP error! status: ${response.status}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  public async post(data: Json) {
    try {
      const response = await axios.post(this.baseURL, data)
      if (response.status !== 200)
        throw new Error(`HTTP error! status: ${response.status}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  public async echo(data: ScraperScrapeResult) {
    return data
  }
}