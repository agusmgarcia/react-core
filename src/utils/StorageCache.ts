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
   */
  constructor(storageName: string, storage: Storage, maxCacheTime?: number) {
    super(maxCacheTime, loadItemsFromStore(storage, storageName));
    this.storage = storage;
    this.storageName = storageName;
  }

  /**
   * Retrieves a cached value associated with the given key or creates it using the provided factory function.
   * If the value does not exist in the cache, the factory function is invoked to generate the value,
   * which is then stored in the cache along with its expiration time.
   *
   * @template TResult - The type of the result to be cached.
   * @param key - The unique identifier for the cached value.
   * @param factory - A function that generates the value to be cached. It can return either a value or a Promise.
   * @param signal - An AbortSignal to cancel the operation if needed.
   * @param expiresAt - Optional. Specifies the expiration time for the cached value. It can be:
   *   - A number representing the timestamp in milliseconds when the value expires.
   *   - A function that takes the result as input and returns the expiration timestamp.
   *   - If not provided, a default expiration time is calculated using `this.maxCacheTime`.
   * @returns A Promise that resolves to the cached or newly created value.
   * @throws If the factory function throws an error, the error is saved in the cache with a short expiration time
   *         (1 second) and then re-thrown.
   */
  override getOrCreate<TResult>(
    key: string,
    factory: Func<TResult | Promise<TResult>, [signal: AbortSignal]>,
    signal: AbortSignal,
    expiresAt?: number | Func<number, [result: TResult]>,
  ): Promise<TResult> {
    const newExpiresAt = (result: TResult) =>
      !expiresAt
        ? Date.now() + this.maxCacheTime
        : typeof expiresAt === "number"
          ? expiresAt
          : expiresAt(result);

    return super.getOrCreate(
      key,
      async (signal) => {
        try {
          const result = await factory(signal);

          saveItemIntoStore(this.storage, this.storageName, key, {
            expiresAt: newExpiresAt(result),
            result,
          });

          return result;
        } catch (error) {
          signal.throwIfAborted();

          saveItemIntoStore(this.storage, this.storageName, key, {
            error,
            expiresAt: Date.now() + 1000,
          });

          throw error;
        }
      },
      signal,
      newExpiresAt,
    );
  }
}

function loadItemsFromStore(
  storage: StorageCache["storage"],
  storageName: StorageCache["storageName"],
): Cache["items"] {
  if (isSSR()) return {};

  const item = window[`${storage}Storage`].getItem(storageName);
  if (!item) return {};

  return JSON.parse(item);
}

function saveItemIntoStore(
  storage: StorageCache["storage"],
  storageName: StorageCache["storageName"],
  key: string,
  item: Cache["items"][string],
): void {
  if (isSSR()) return;

  const items = loadItemsFromStore(storage, storageName);
  items[key] = item;

  window[`${storage}Storage`].setItem(storageName, JSON.stringify(items));
}
