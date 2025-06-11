import isSSR from "./isSSR";
import StorageCache from "./StorageCache";

jest.mock("./isSSR", () => jest.fn());

const mockIsSSR = isSSR as jest.Mock;

describe("StorageCache", () => {
  let localStorageMock: Storage;
  let sessionStorageMock: Storage;

  beforeEach(() => {
    localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        clear: jest.fn(() => {
          store = {};
        }),
        getItem: jest.fn((key: string) => store[key] ?? null),
        key: jest.fn(),
        length: 0,
        removeItem: jest.fn((key: string) => {
          delete store[key];
        }),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value;
        }),
      } as unknown as Storage;
    })();

    sessionStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        clear: jest.fn(() => {
          store = {};
        }),
        getItem: jest.fn((key: string) => store[key] ?? null),
        key: jest.fn(),
        length: 0,
        removeItem: jest.fn((key: string) => {
          delete store[key];
        }),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value;
        }),
      } as unknown as Storage;
    })();

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
    Object.defineProperty(window, "sessionStorage", {
      value: sessionStorageMock,
      writable: true,
    });
    mockIsSSR.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should store and retrieve values using localStorage", async () => {
    const cache = new StorageCache("testCache", "local", 1000);
    const value = await cache.getOrCreate(
      "foo",
      () => "bar",
      new AbortController().signal,
    );
    expect(value).toBe("bar");
    expect(localStorageMock.setItem).toHaveBeenCalled();
    const stored = JSON.parse(localStorageMock.getItem("testCache")!);
    expect(stored.foo.result).toBe("bar");
  });

  it("should store and retrieve values using sessionStorage", async () => {
    const cache = new StorageCache("testCache", "session", 1000);
    const value = await cache.getOrCreate(
      "baz",
      () => "qux",
      new AbortController().signal,
    );
    expect(value).toBe("qux");
    expect(sessionStorageMock.setItem).toHaveBeenCalled();
    const stored = JSON.parse(sessionStorageMock.getItem("testCache")!);
    expect(stored.baz.result).toBe("qux");
  });

  it("should use the factory only if value is not cached", async () => {
    const cache = new StorageCache("testCache", "local", 1000);
    const factory = jest.fn(() => "abc");
    await cache.getOrCreate("key", factory, new AbortController().signal);
    await cache.getOrCreate("key", factory, new AbortController().signal);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("should handle errors from factory and cache them briefly", async () => {
    const cache = new StorageCache("testCache", "local", 1000);
    const factory = jest.fn(() => {
      throw new Error("fail");
    });
    await expect(
      cache.getOrCreate("err", factory, new AbortController().signal),
    ).rejects.toThrow("fail");
    // Try again, should not call factory again (error is cached)
    await expect(
      cache.getOrCreate("err", factory, new AbortController().signal),
    ).rejects.toThrow("fail");
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("should not access storage in SSR", async () => {
    mockIsSSR.mockReturnValue(true);
    const cache = new StorageCache("ssrCache", "local", 1000);
    const value = await cache.getOrCreate(
      "foo",
      () => "bar",
      new AbortController().signal,
    );
    expect(value).toBe("bar");
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it("should allow setting values directly", async () => {
    const cache = new StorageCache("testCache", "local", 1000);
    await cache.set("direct", 123);
    const stored = JSON.parse(localStorageMock.getItem("testCache")!);
    expect(stored.direct.result).toBe(123);
  });

  it("should respect expiresAt function", async () => {
    const cache = new StorageCache("testCache", "local", 1000);
    const expiresAt = jest.fn(() => Date.now() + 5000);
    await cache.getOrCreate(
      "exp",
      () => "val",
      new AbortController().signal,
      expiresAt,
    );
    expect(expiresAt).toHaveBeenCalledWith("val");
    const stored = JSON.parse(localStorageMock.getItem("testCache")!);
    expect(stored.exp.expiresAt).toBeGreaterThan(Date.now());
  });

  it("should use versioned storage name and delete older versions", async () => {
    // Simulate existing storages with different versions
    localStorageMock.setItem(
      "testCache",
      JSON.stringify({ old: { result: 1 } }),
    );
    localStorageMock.setItem(
      "testCache.1",
      JSON.stringify({ v1: { result: 2 } }),
    );
    localStorageMock.setItem(
      "testCache.2",
      JSON.stringify({ v2: { result: 3 } }),
    );

    // Mock key/length for iteration
    (localStorageMock as any).length = 3;
    (localStorageMock.key as jest.Mock)
      .mockImplementationOnce(
        (i: number) => ["testCache", "testCache.1", "testCache.2"][i],
      )
      .mockImplementationOnce(
        (i: number) => ["testCache", "testCache.1", "testCache.2"][i],
      )
      .mockImplementationOnce(
        (i: number) => ["testCache", "testCache.1", "testCache.2"][i],
      );

    const cache = new StorageCache("testCache", "local", 1000, "2");
    await cache.set("foo", "bar");

    // Only "testCache.2" should remain
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("testCache");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("testCache.1");
    expect(localStorageMock.removeItem).not.toHaveBeenCalledWith("testCache.2");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "testCache.2",
      expect.any(String),
    );
    const stored = JSON.parse(localStorageMock.getItem("testCache.2")!);
    expect(stored.foo.result).toBe("bar");
  });

  it("should use unversioned storage name if version is empty", async () => {
    const cache = new StorageCache("myCache", "session", 1000, "");
    await cache.set("a", 42);
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
      "myCache",
      expect.any(String),
    );
    const stored = JSON.parse(sessionStorageMock.getItem("myCache")!);
    expect(stored.a.result).toBe(42);
  });

  it("should use versioned storage name if version is provided", async () => {
    const cache = new StorageCache("myCache", "session", 1000, "v5");
    await cache.set("b", 99);
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
      "myCache.v5",
      expect.any(String),
    );
    const stored = JSON.parse(sessionStorageMock.getItem("myCache.v5")!);
    expect(stored.b.result).toBe(99);
  });

  it("should not delete unrelated keys in storage", async () => {
    localStorageMock.setItem("unrelated", JSON.stringify({}));
    (localStorageMock as any).length = 2;
    (localStorageMock.key as jest.Mock)
      .mockImplementationOnce((i: number) => ["testCache", "unrelated"][i])
      .mockImplementationOnce((i: number) => ["testCache", "unrelated"][i]);
    const cache = new StorageCache("testCache", "local", 1000, "v1");
    await cache.set("foo", "bar");
    expect(localStorageMock.removeItem).not.toHaveBeenCalledWith("unrelated");
  });

  it("should not throw if storage is empty or missing", async () => {
    localStorageMock.getItem = jest.fn(() => null);
    const cache = new StorageCache("emptyCache", "local", 1000, "v1");
    await expect(
      cache.getOrCreate("foo", () => "bar", new AbortController().signal),
    ).resolves.toBe("bar");
  });
});
