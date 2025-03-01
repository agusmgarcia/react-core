import Cache from "./Cache";

describe("Cache", () => {
  it("gets a new item", async () => {
    const cache = new Cache();

    const factory = jest.fn(() => Promise.resolve({ name: "Foo Bar" }));

    const result = await cache.getOrCreate("person", factory);

    expect(result).toStrictEqual({ name: "Foo Bar" });
    expect(factory).toHaveBeenCalled();
  });

  it("gets an existing item", async () => {
    const cache = new Cache(undefined, {
      person: { expiresAt: Date.now() + 100_000, result: { name: "John Doe" } },
    });

    const factory = jest.fn(() => Promise.resolve({ name: "Foo Bar" }));

    const result = await cache.getOrCreate("person", factory);

    expect(result).toStrictEqual({ name: "John Doe" });
    expect(factory).not.toHaveBeenCalled();
  });
});
