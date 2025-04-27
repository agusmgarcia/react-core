import emptyFunction from "./emptyFunction";

describe("emptyFunction", () => {
  it("should be a function", () => {
    expect(typeof emptyFunction).toBe("function");
  });

  it("should not throw an error when called", () => {
    expect(() => emptyFunction()).not.toThrow();
  });

  it("should return undefined when called", () => {
    expect(emptyFunction()).toBeUndefined();
  });
});
