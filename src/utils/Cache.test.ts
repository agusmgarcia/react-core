import Cache from "./Cache";

describe("Cache", () => {
  let cache: Cache;

  beforeEach(() => {
    cache = new Cache();
  });

  it("should return a cached value if it exists and is not expired", async () => {
    const key = "testKey";
    const factory = jest.fn().mockResolvedValue("testValue");

    await cache.getOrCreate(key, factory);
    const result = await cache.getOrCreate(key, factory);

    expect(result).toBe("testValue");
    expect(factory).toHaveBeenCalledTimes(1); // Factory should only be called once
  });

  it("should call the factory function again if the cache is expired", async () => {
    const key = "testKey";
    const factory = jest.fn().mockResolvedValue("newValue");

    await cache.getOrCreate(key, factory, Date.now() - 1); // Expired cache
    const result = await cache.getOrCreate(key, factory);

    expect(result).toBe("newValue");
    expect(factory).toHaveBeenCalledTimes(2); // Factory should be called twice
  });

  it("should handle errors and cache them temporarily", async () => {
    const key = "errorKey";
    const factory = jest.fn().mockRejectedValue(new Error("Test error"));

    await expect(cache.getOrCreate(key, factory)).rejects.toThrow("Test error");
    expect(factory).toHaveBeenCalledTimes(1);

    // Try again immediately, should return the cached error
    await expect(cache.getOrCreate(key, factory)).rejects.toThrow("Test error");
    expect(factory).toHaveBeenCalledTimes(1); // Factory should not be called again
  });

  it("should allow custom expiration times", async () => {
    const key = "customExpireKey";
    const factory = jest.fn().mockResolvedValue("customValue");
    const customExpiresAt = Date.now() + 5000;

    await cache.getOrCreate(key, factory, customExpiresAt);
    const result = await cache.getOrCreate(key, factory);

    expect(result).toBe("customValue");
    expect(factory).toHaveBeenCalledTimes(1); // Factory should only be called once
  });

  it("should support dynamic expiration time based on the result", async () => {
    const key = "dynamicExpireKey";
    const factory = jest.fn().mockResolvedValue("dynamicValue");
    const dynamicExpiresAt = jest.fn(
      (result: string) =>
        Date.now() + (result === "dynamicValue" ? 2000 : 1000),
    );

    await cache.getOrCreate(key, factory, dynamicExpiresAt);
    const result = await cache.getOrCreate(key, factory);

    expect(result).toBe("dynamicValue");
    expect(dynamicExpiresAt).toHaveBeenCalledWith("dynamicValue");
    expect(factory).toHaveBeenCalledTimes(1); // Factory should only be called once
  });
});
