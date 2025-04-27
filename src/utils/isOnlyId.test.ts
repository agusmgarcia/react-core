import isOnlyId from "./isOnlyId";

describe("isOnlyId", () => {
  it("should return true for an object with only the specified id key", () => {
    const maybeOnlyId = { id: 123 };
    const result = isOnlyId(maybeOnlyId, "id");
    expect(result).toBe(true);
  });

  it("should return false for an object with additional keys", () => {
    const maybeOnlyId = { id: 123, name: "test" };
    const result = isOnlyId(maybeOnlyId, "id");
    expect(result).toBe(false);
  });

  it("should return false for an object without the specified id key", () => {
    const maybeOnlyId = { name: "test" };
    const result = isOnlyId(maybeOnlyId as any, "id");
    expect(result).toBe(false);
  });

  it("should return false for a non-object value", () => {
    const maybeOnlyId = "not-an-object";
    const result = isOnlyId(maybeOnlyId as any, "id");
    expect(result).toBe(false);
  });

  it("should return false for null", () => {
    const maybeOnlyId = null;
    const result = isOnlyId(maybeOnlyId as any, "id");
    expect(result).toBe(false);
  });

  it("should return false for an empty object", () => {
    const maybeOnlyId = {};
    const result = isOnlyId(maybeOnlyId as any, "id");
    expect(result).toBe(false);
  });

  it("should return false if the key does not match the specified id", () => {
    const maybeOnlyId = { otherKey: 123 };
    const result = isOnlyId(maybeOnlyId as any, "id");
    expect(result).toBe(false);
  });
});
