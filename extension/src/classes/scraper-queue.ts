import type { ScraperQueueItemType } from '@src/schema';
import { Stringify } from '@src/utils';
import { v4 as uuidv4 } from 'uuid';
import { Queue } from '.';

export class ScraperQueue extends Queue<ScraperQueueItemType> {
  constructor(items: ScraperQueueItemType[] = []) {
    super(items);
  }

  public insert(item: Omit<ScraperQueueItemType, 'id'>): void {
    try {
      const newItem = { ...item, id: uuidv4() };
      this.items.push(newItem);
    } catch (error) {
      console.error(
        `Error inserting item: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public remove(item: Pick<ScraperQueueItemType, 'id'>): void {
    try {
      this.items = this.items.filter((i: ScraperQueueItemType) => i.id !== item.id);
    } catch (error) {
      console.error(
        `Error removing item: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public update(item: ScraperQueueItemType): void {
    try {
      this.items = this.items.map((i: ScraperQueueItemType) => (i.id === item.id ? item : i));
    } catch (error) {
      console.error(
        `Error updating item: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public getItem(id: UUID): ScraperQueueItemType | undefined {
    try {
      return this.items.find((i: ScraperQueueItemType) => i.id === id);
    } catch (error) {
      console.error(
        `Error getting item: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public next(): ScraperQueueItemType | undefined {
    try {
      return this.items.shift();
    } catch (error) {
      console.error(
        `Error getting next item: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public static make() {
    try {
      return new ScraperQueue();
    } catch (error) {
      console.error(
        `Error creating ScraperQueue: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public clear(): void {
    try {
      this.items = [];
    } catch (error) {
      console.error(
        `Error clearing items: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public log(): string {
    try {
      return Stringify(this.items);
    } catch (error) {
      console.error(
        `Error logging items: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
