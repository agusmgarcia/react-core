import type AsyncFunc from "./AsyncFunc.types";
import Cache from "./Cache";
import type Func from "./Func.types";
import isSSR from "./isSSR";

type Storage = "local" | "session";

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
 * @example
 * ```typescript
 * const storageCache = new StorageCache("myCache", "local", 60000);
 * const value = await storageCache.getOrCreate("key", async () => {
 *   return fetchDataFromAPI();
 * });
 * ```
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
   * @param storage - The storage mechanism (e.g., `localStorage` or `sessionStorage`) where cached items will be persisted.
   * @param maxCacheTime - Optional. The maximum time (in milliseconds) that a cached item is considered valid.
   *                       If not provided, a default value will be used.
   * @param version - The version of the cache, used for cache invalidation.
   */
  constructor(
    storageName: string,
    storage: Storage,
    maxCacheTime?: number,
    version?: string,
  ) {
    super(maxCacheTime, loadItemsFromStore(storage, storageName));
    this.storage = storage;
    this.storageName = `${storageName}${!!version ? `.${version}` : ""}`;
    deleteOlderStorages(storage, storageName, version || "");
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
