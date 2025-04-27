import * as finds from "./finds";

describe("finds utility functions", () => {
  describe("first", () => {
    it("should return true for the first element", () => {
      const result = finds.first(1, 0, [1, 2, 3]);
      expect(result).toBe(true);
    });

    it("should return false for non-first elements", () => {
      const result = finds.first(2, 1, [1, 2, 3]);
      expect(result).toBe(false);
    });
  });

  describe("single", () => {
    it("should return true for a single element in the array", () => {
      const result = finds.single(1, 0, [1]);
      expect(result).toBe(true);
    });

    it("should throw an error if there are multiple elements in the array", () => {
      expect(() => finds.single(1, 0, [1, 2])).toThrow(
        "There are more than one element in the array",
      );
    });

    it("should return false for non-first elements in a single-element array", () => {
      const result = finds.single(1, 1, [1]);
      expect(result).toBe(false);
    });
  });

  describe("singleOrDefault", () => {
    it("should return true for a single element in the array", () => {
      const result = finds.singleOrDefault(1, 0, [1]);
      expect(result).toBe(true);
    });

    it("should return false if there are multiple elements in the array", () => {
      const result = finds.singleOrDefault(1, 0, [1, 2]);
      expect(result).toBe(false);
    });

    it("should return false for non-first elements in a single-element array", () => {
      const result = finds.singleOrDefault(1, 1, [1]);
      expect(result).toBe(false);
    });
  });
});
