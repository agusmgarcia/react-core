import Cache from "./Cache";
import type Func from "./Func.types";
import isSSR from "./isSSR";

type Storage = "local" | "session";

export default class StorageCache extends Cache {
  private readonly storageName: string;
  private readonly storage: Storage;

  constructor(storageName: string, storage: Storage, maxCacheTime?: number) {
    super(maxCacheTime, loadItemsFromStore(storage, storageName));
    this.storage = storage;
    this.storageName = storageName;
  }

  override getOrCreate<TResult>(
    key: string,
    factory: Func<TResult | Promise<TResult>>,
    expiresAt?: number | Func<number, [result: TResult]>,
  ): Promise<TResult> {
    const newExpiresAt = (result: TResult) =>
      expiresAt === undefined
        ? Date.now() + this.maxCacheTime
        : typeof expiresAt === "number"
          ? expiresAt
          : expiresAt(result);

    return super.getOrCreate(
      key,
      async () => {
        const result = await factory();

        saveItemIntoStore(this.storage, this.storageName, key, {
          expiresAt: newExpiresAt(result),
          result,
        });

        return result;
      },
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
  if (item === null) return {};

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
