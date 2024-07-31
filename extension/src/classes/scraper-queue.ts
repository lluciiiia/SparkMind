import { Queue } from '.'

export class ScraperQueue {
  private jobs: Queue

  constructor() {
    this.jobs = new Queue()
  }
}