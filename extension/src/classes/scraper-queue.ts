import { Queue } from '.';

export class ScraperQueue implements Queue<ScraperJob> {
  constructor() {
    this.jobs = new Queue();
  }
}
