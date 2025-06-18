import type AsyncFunc from "./AsyncFunc.types";
import Cache from "./Cache";
import type Func from "./Func.types";
import isSSR from "./isSSR";

/**
 * A specialized cache implementation that uses browser storage mechanisms
 * (`localStorage` or `sessionStorage`) to persist cached items across sessions.
 * This class extends the `Cache` class and provides additional functionality
 * for interacting with browser storage.
 *
 * @remarks
 * This class is designed to work in environments where browser storage is available.
 * It gracefully handles server-side rendering (SSR) scenarios by avoiding storage access.
 *
 * @extends Cache
 */
export default class StorageCache extends Cache {
  private readonly storageName: string;
  private readonly storage: Storage;

  /**
   * Creates an instance of the `StorageCache` class.
   *
   * @param storageName - The name of the storage to be used for caching.
   * @param options - Optional configuration options for the cache.
   */
  constructor(storageName: string, options?: Partial<Options>) {
    super({
      items: loadItemsFromStore(options?.storage || "session", storageName),
      maxCacheTime: options?.maxCacheTime,
      maxErrorTime: options?.maxErrorTime,
    });
    this.storage = options?.storage || "session";
    this.storageName = `${storageName}${!!options?.version ? `.${options.version}` : ""}`;
    deleteOlderStorages(this.storage, storageName, options?.version || "");
  }

  override async getOrCreate<TResult>(
    key: string,
    factory: Func<TResult> | AsyncFunc<TResult, [signal: AbortSignal]>,
    signal: AbortSignal,
    expiresAt?: number | Func<number, [result: TResult]>,
  ): Promise<TResult> {
    const item = await this.rawSet(key, factory, false, signal, expiresAt);
    saveItemIntoStore(this.storage, this.storageName, key, item);
    if ("result" in item) return item.result;
    throw item.error;
  }

  override async set<TValue>(
    key: string,
    value: TValue,
    expiresAt?: number | Func<number, [value: TValue]>,
  ): Promise<void> {
    const item = await this.rawSet(key, value, true, undefined, expiresAt);
    saveItemIntoStore(this.storage, this.storageName, key, item);
    if ("result" in item) return item.result;
    throw item.error;
  }
}

function loadItemsFromStore(
  storage: Storage,
  storageName: string,
): Cache["items"] {
  if (isSSR()) return {};

  const item = window[`${storage}Storage`].getItem(storageName);
  if (!item) return {};

  return JSON.parse(item);
}

function saveItemIntoStore(
  storage: Storage,
  storageName: string,
  key: string,
  item: Cache["items"][string],
): void {
  if (isSSR()) return;

  const items = loadItemsFromStore(storage, storageName);
  items[key] = item;

  window[`${storage}Storage`].setItem(storageName, JSON.stringify(items));
}

function deleteOlderStorages(
  storage: Storage,
  storageName: string,
  version: string,
): void {
  if (isSSR()) return;

  const realStorageName = `${storageName}${!!version ? `.${version}` : ""}`;
  const keysToDelete = new Array<string>();

  for (let i = 0; i < window[`${storage}Storage`].length; i++) {
    const key = window[`${storage}Storage`].key(i);
    if (!key) continue;
    if (key === realStorageName) continue;
    if (!key.startsWith(storageName)) continue;
    keysToDelete.push(key);
  }

  keysToDelete.forEach((key) => window[`${storage}Storage`].removeItem(key));
}

type Options = {
  /**
   * The maximum time in milliseconds that cached items are considered valid.
   * Defaults to 15 minutes (900,000 ms).
   */
  maxCacheTime: number;
  /**
   * The maximum time in milliseconds that errors are cached before they are considered expired.
   * Defaults to 1 second (1,000 ms).
   */
  maxErrorTime: number;
  /**
   * The storage type to use for caching.
   * Can be either "local" for `localStorage` or "session" for `sessionStorage`.
   * Defaults to "session".
   */
  storage: Storage;
  /**
   * The version of the cache.
   * This is used to differentiate between different versions of the cache.
   * If not provided, the cache will not include a version suffix in the storage key.
   * This can be useful for cache invalidation when the structure of cached items changes.
   */
  version: string;
};

type Storage = "local" | "session";
