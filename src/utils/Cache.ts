import { Mutex } from "async-mutex";

import type Func from "./Func.types";

type Item = { expiresAt: number } & ({ result: any } | { error: any });

/**
 * A utility class for caching asynchronous operations with expiration times.
 */
export default class Cache {
  protected readonly maxCacheTime: number;

  private readonly mutexes: Record<string, Mutex>;
  private readonly items: Record<string, Item>;

  /**
   * Creates an instance of the Cache class.
   *
   * @param maxCacheTime - The maximum time (in milliseconds) an item can remain in the cache before expiring. Defaults to 15 minutes (900,000 ms).
   * @param items - An optional initial set of cached items. Each item includes an expiration time and either a result or an error.
   */
  constructor(maxCacheTime = 900_000, items: Record<string, Item> = {}) {
    this.maxCacheTime = maxCacheTime;
    this.mutexes = {};
    this.items = items;
  }

  /**
   * Retrieves a cached value by key or creates it using the provided factory function if it doesn't exist or has expired.
   *
   * @typeParam TResult - The type of the result produced by the factory function.
   *
   * @param key - The unique key identifying the cached item.
   * @param factory - A function that produces the value to be cached. It can return either a value or a Promise resolving to a value.
   * @param expiresAt - Optional. Specifies the expiration time for the cached item. It can be:
   *   - A number representing the absolute expiration timestamp.
   *   - A function that takes the result as input and returns the expiration timestamp.
   *   - If not provided, the default `maxCacheTime` will be used.
   *
   * @returns A Promise resolving to the cached or newly created value.
   *
   * @throws If the factory function throws an error, the error will be cached and re-thrown for the following second.
   */
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
