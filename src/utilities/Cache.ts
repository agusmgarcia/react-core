import { Mutex } from "async-mutex";

export default class Cache {
  private readonly mutexes: Record<string, Mutex>;
  private readonly items: Record<string, { createdAt: number; result: any }>;
  private readonly maxCacheTime: number;

  constructor(
    maxCacheTime: Cache["maxCacheTime"] = 900_000,
    items: Cache["items"] = {},
  ) {
    this.mutexes = {};
    this.items = items;
    this.maxCacheTime = maxCacheTime;
  }

  getOrCreate<TResult>(
    key: string,
    factory: () => TResult | Promise<TResult>,
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
