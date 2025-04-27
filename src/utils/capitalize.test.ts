import capitalize from "./capitalize";

describe("capitalize", () => {
  it("should capitalize the first letter of a lowercase string", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("should not change the first letter if it is already capitalized", () => {
    expect(capitalize("World")).toBe("World");
  });

  it("should handle single-character strings", () => {
    expect(capitalize("a")).toBe("A");
    expect(capitalize("B")).toBe("B");
  });

  it("should return an empty string if input is an empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("should handle strings with special characters", () => {
    expect(capitalize("!hello")).toBe("!hello");
    expect(capitalize("123abc")).toBe("123abc");
  });

  it("should handle strings with spaces", () => {
    expect(capitalize(" hello")).toBe(" hello");
    expect(capitalize(" world")).toBe(" world");
  });
});
