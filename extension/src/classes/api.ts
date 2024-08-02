import axios from 'axios'

export class Api {
  private constructor(readonly baseURL: string) {}

  public static make(baseURL: string) {
    return new Api(baseURL)
  }

  public async post(url: string, data: Json) {
    try {
      const response = await axios.post(url, data)
      if (response.status !== 200)
        throw new Error(`HTTP error! status: ${response.status}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}