import isSSR from "./isSSR";

describe("isSSR", () => {
  it("should return false when window is defined", () => {
    expect(isSSR()).toBe(false);
  });
});
