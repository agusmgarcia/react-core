import Cache from "./Cache";
import isSSR from "./isSSR";

export default class StorageCache extends Cache {
  private readonly storageName: string;
  private readonly storage: "local" | "session";

  constructor(
    storageName: StorageCache["storageName"],
    storage: StorageCache["storage"] = "session",
    maxCacheTime?: Cache["maxCacheTime"],
  ) {
    super(maxCacheTime, loadItemsFromStore(storage, storageName));
    this.storage = storage;
    this.storageName = storageName;
  }

  override getOrCreate<TResult>(
    key: string,
    factory: () => TResult | Promise<TResult>,
  ): Promise<TResult> {
    return super.getOrCreate(key, async () => {
      const result = await factory();
      const now = Date.now();
      saveItemIntoStore(this.storage, this.storageName, key, {
        createdAt: now,
        result,
      });
      return result;
    });
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
