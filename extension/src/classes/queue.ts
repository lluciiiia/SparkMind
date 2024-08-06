export class Queue<T> {
  public constructor(
    public items: any = {},
    public front = 0,
    public back = 0,
  ) {}

  public enqueue(item: T): string {
    this.items[this.back] = item;
    this.back++;
    return `${item} inserted`;
  }

  dequeue(): T {
    const item = this.items[this.front];
    delete this.items[this.front];
    this.front++;
    return item;
  }

  peek(): T {
    return this.items[this.front];
  }

  get(): T {
    return this.items;
  }

  isEmpty(): boolean {
    return this.front === this.back;
  }

  size(): number {
    return this.back - this.front;
  }
}
