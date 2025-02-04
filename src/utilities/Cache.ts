import { Mutex } from "async-mutex";

import type Func from "./Func.types";

type Item = { expiresAt: number; result: any };

export default class Cache {
  protected readonly maxCacheTime: number;

  private readonly mutexes: Record<string, Mutex>;
  private readonly items: Record<string, Item>;

  constructor(maxCacheTime = 900_000, items: Record<string, Item> = {}) {
    this.maxCacheTime = maxCacheTime;
    this.mutexes = {};
    this.items = items;
  }

  getOrCreate<TResult>(
    key: string,
    factory: Func<TResult | Promise<TResult>>,
    expiresAt?: number | Func<number, [result: TResult]>,
  ): Promise<TResult> {
    if (this.mutexes[key] === undefined) this.mutexes[key] = new Mutex();

    return this.mutexes[key].runExclusive(async () => {
      if (
        this.items[key] === undefined ||
        Date.now() >= this.items[key].expiresAt
      ) {
        const result = await factory();

        expiresAt =
          expiresAt === undefined
            ? Date.now() + this.maxCacheTime
            : typeof expiresAt === "number"
              ? expiresAt
              : expiresAt(result);

        this.items[key] = { expiresAt, result };
      }

      return this.items[key].result;
    });
  }
}
