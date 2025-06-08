import isSSR from "./isSSR";
import StorageCache from "./StorageCache";

jest.mock("./isSSR", () => jest.fn());

const mockIsSSR = isSSR as jest.Mock;

describe("StorageCache", () => {
  let localStorageMock: Storage;
  let sessionStorageMock: Storage;

  beforeAll(() => {
    AbortSignal.prototype.throwIfAborted = function (this: AbortSignal) {
      if (!this.aborted) return;
      throw new Error(this.reason);
    };
  });

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
});
