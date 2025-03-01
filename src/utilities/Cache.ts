import { Mutex } from "async-mutex";

import type Func from "./Func.types";

type Item = { expiresAt: number } & ({ result: any } | { error: any });

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
    if (!this.mutexes[key]) this.mutexes[key] = new Mutex();

    return this.mutexes[key].runExclusive(async () => {
      if (!this.items[key] || Date.now() >= this.items[key].expiresAt) {
        try {
          const result = await factory();

          expiresAt = !expiresAt
            ? Date.now() + this.maxCacheTime
            : typeof expiresAt === "number"
              ? expiresAt
              : expiresAt(result);

          this.items[key] = { expiresAt, result };
        } catch (error) {
          expiresAt = Date.now() + 1_000;
          this.items[key] = { error, expiresAt };
        }
      }

      if ("result" in this.items[key]) return this.items[key].result;
      else throw this.items[key].error;
    });
  }
}
