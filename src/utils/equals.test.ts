import * as equals from "./equals";

describe("equals", () => {
  describe("strict", () => {
    it("should return true for identical primitives", () => {
      expect(equals.strict(1, 1)).toBe(true);
      expect(equals.strict("test", "test")).toBe(true);
      expect(equals.strict(true, true)).toBe(true);
    });

    it("should return false for different primitives", () => {
      expect(equals.strict(1, 2)).toBe(false);
      expect(equals.strict("test", "other")).toBe(false);
      expect(equals.strict(true, false)).toBe(false);
    });

    it("should return true for the same object reference", () => {
      const obj = { a: 1 };
      expect(equals.strict(obj, obj)).toBe(true);
    });

    it("should return false for different object references with the same structure", () => {
      expect(equals.strict({ a: 1 }, { a: 1 })).toBe(false);
    });
  });

  describe("shallow", () => {
    it("should return true for shallowly equal objects", () => {
      expect(equals.shallow({ a: 1 }, { a: 1 })).toBe(true);
    });

    it("should return false for objects with different keys or values", () => {
      expect(equals.shallow({ a: 1 }, { b: 1 })).toBe(false);
      expect(equals.shallow({ a: 1 }, { a: 2 })).toBe(false);
    });

    it("should return true for shallowly equal arrays", () => {
      expect(equals.shallow([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it("should return false for arrays with different elements", () => {
      expect(equals.shallow([1, 2, 3], [1, 2, 4])).toBe(false);
    });
  });

  describe("deep", () => {
    it("should return true for deeply equal objects", () => {
      expect(equals.deep({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    });

    it("should return false for objects with different nested values", () => {
      expect(equals.deep({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });

    it("should return true for deeply equal arrays", () => {
      expect(equals.deep([1, [2, 3]], [1, [2, 3]])).toBe(true);
    });

    it("should return false for arrays with different nested elements", () => {
      expect(equals.deep([1, [2, 3]], [1, [2, 4]])).toBe(false);
    });
  });
});
