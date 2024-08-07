import type { ScraperQueueItemType } from '@src/schema';
import { Stringify } from '@src/utils';
import { v4 as uuidv4 } from 'uuid';
import { Queue } from '.';

export class ScraperQueue extends Queue<ScraperQueueItemType> {
  constructor(items: ScraperQueueItemType[] = []) {
    super(items);
  }

  public insert(item: Omit<ScraperQueueItemType, 'id'>): void {
    const newItem = { ...item, id: uuidv4() };
    this.items.push(newItem);
  }

  public remove(item: Pick<ScraperQueueItemType, 'id'>): void {
    this.items = this.items.filter((i: ScraperQueueItemType) => i.id !== item.id);
  }

  public update(item: ScraperQueueItemType): void {
    this.items = this.items.map((i: ScraperQueueItemType) => (i.id === item.id ? item : i));
  }

  public getItem(id: UUID): ScraperQueueItemType | undefined {
    return this.items.find((i: ScraperQueueItemType) => i.id === id);
  }

  public next(): ScraperQueueItemType | undefined {
    return this.items.shift();
  }

  public static make() {
    return new ScraperQueue();
  }

  public clear(): void {
    delete this.items;
  }

  public log(): string {
    return Stringify(this.items);
  }
}
