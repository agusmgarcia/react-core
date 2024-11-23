import { Mutex } from "async-mutex";

import type Func from "./Func.types";

type Item = { createdAt: number; result: any };

export default class Cache {
  private readonly mutexes: Record<string, Mutex>;
  private readonly items: Record<string, Item>;
  private readonly maxCacheTime: number;

  constructor(maxCacheTime = 900_000, items: Record<string, Item> = {}) {
    this.mutexes = {};
    this.items = items;
    this.maxCacheTime = maxCacheTime;
  }

  getOrCreate<TResult>(
    key: string,
    factory: Func<TResult | Promise<TResult>>,
  ): Promise<TResult> {
    if (this.mutexes[key] === undefined) this.mutexes[key] = new Mutex();
    return this.mutexes[key].runExclusive(async () => {
      if (
        this.items[key] === undefined ||
        Date.now() - this.items[key].createdAt > this.maxCacheTime
      ) {
        const result = await factory();
        this.items[key] = { createdAt: Date.now(), result };
      }

      return this.items[key].result;
    });
  }
}
