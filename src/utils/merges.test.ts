import * as merges from "./merges";

describe("merges", () => {
  describe("strict", () => {
    it("should return the next value when base and next are equal", () => {
      const base = { a: 1 };
      const next = { a: 1 };
      expect(merges.strict(base, next)).toEqual(next);
    });

    it("should strictly merge two objects", () => {
      const base = { a: 1, b: { c: 2 } };
      const next = { b: { d: 3 }, e: 4 };
      expect(merges.strict(base, next)).toEqual(next);
    });
  });

  describe("shallow", () => {
    it("should perform a shallow merge with default options", () => {
      const base = { a: 1, b: 2 };
      const next = { b: 3, c: 4 };
      expect(merges.shallow(base, next)).toEqual({ a: 1, b: 3, c: 4 });
    });

    it("should respect the level option", () => {
      const base = { a: { b: { c: 1 } } };
      const next = { a: { b: { d: 2 } } };
      expect(merges.shallow(base, next, { level: 1 })).toEqual({
        a: { b: { d: 2 } },
      });
    });

    it("should handle shallow merging with complex nested objects", () => {
      const base = {
        a: { b: { c: 1, d: [1, 2] }, e: "hello" },
        f: [1, 2],
      };
      const next = {
        a: { b: { c: 2, d: [3, 4] }, e: "world" },
        f: [2, 3],
        g: true,
      };
      expect(merges.shallow(base, next)).toEqual({
        a: { b: { c: 2, d: [3, 4] }, e: "world" },
        f: [2, 3],
        g: true,
      });
    });

    it("should handle shallow merging with arrays of objects", () => {
      const base = {
        a: [
          { id: 1, value: "a" },
          { id: 2, value: "b" },
        ],
      };
      const next = {
        a: [
          { id: 2, value: "c" },
          { id: 3, value: "d" },
        ],
      };
      const comparator = (x: any, y: any) => x.id === y.id;
      expect(
        merges.shallow(base, next, { array: { comparator }, level: 2 }),
      ).toEqual({
        a: [
          { id: 1, value: "a" },
          { id: 2, value: "c" },
          { id: 3, value: "d" },
        ],
      });
    });

    it("should handle shallow merging with deeply nested objects and limited levels", () => {
      const base = {
        a: { b: { c: { d: { e: 1 } } } },
        f: "hello",
      };
      const next = {
        a: { b: { c: { d: { e: 2, f: 3 } } } },
        f: "world",
      };
      expect(merges.shallow(base, next, { level: 2 })).toEqual({
        a: { b: { c: { d: { e: 2, f: 3 } } } },
        f: "world",
      });
    });

    it("should handle shallow merging with mixed data types and arrays", () => {
      const base = {
        a: { b: [1, 2], c: "hello" },
        d: 42,
      };
      const next = {
        a: { b: [3, 4], c: "world" },
        d: { e: 100 },
      };
      expect(merges.shallow(base, next)).toEqual({
        a: { b: [3, 4], c: "world" },
        d: { e: 100 },
      });
    });

    it("should handle shallow merging with undefined and null values", () => {
      const base = { a: { b: null, c: 1 }, d: undefined };
      const next = { a: { b: 2, c: undefined }, d: { e: 3 } };
      expect(merges.shallow(base, next)).toEqual({
        a: { b: 2, c: undefined },
        d: { e: 3 },
      });
    });

    it("should handle shallow merging with a boolean sort parameter set to true", () => {
      const base = { a: ["z", "x", "y"] };
      const next = { a: ["b", "a", "c"] };
      expect(merges.shallow(base, next, { level: 2, sort: true })).toEqual({
        a: ["a", "b", "c", "x", "y", "z"],
      });
    });

    it("should handle shallow merging with a boolean sort parameter set to false", () => {
      const base = { a: ["z", "x", "y"] };
      const next = { a: ["b", "a", "c"] };
      expect(merges.shallow(base, next, { level: 2, sort: false })).toEqual({
        a: ["z", "x", "y", "b", "a", "c"],
      });
    });

    it("should handle shallow merging with a custom sort function", () => {
      const base = { a: [3, 1, 2] };
      const next = { a: [6, 5, 4] };
      const sortFn = (x: number, y: number) => x - y;
      expect(merges.shallow(base, next, { level: 2, sort: sortFn })).toEqual({
        a: [1, 2, 3, 4, 5, 6],
      });
    });

    it("should handle shallow merging with nested arrays and a custom sort function", () => {
      const base = { a: { b: [9, 7, 8] } };
      const next = { a: { b: [6, 5, 4] } };
      const sortFn = (x: number, y: number) => x - y;
      expect(merges.shallow(base, next, { level: 3, sort: sortFn })).toEqual({
        a: { b: [4, 5, 6, 7, 8, 9] },
      });
    });

    it("should handle shallow merging with arrays of objects and a custom sort function", () => {
      const base = {
        a: [
          { id: 3, value: "c" },
          { id: 1, value: "a" },
        ],
      };
      const next = {
        a: [
          { id: 2, value: "b" },
          { id: 4, value: "d" },
        ],
      };
      const sortFn = (x: any, y: any) => x.id - y.id;
      expect(merges.shallow(base, next, { level: 2, sort: sortFn })).toEqual({
        a: [
          { id: 1, value: "a" },
          { id: 2, value: "b" },
          { id: 3, value: "c" },
          { id: 4, value: "d" },
        ],
      });
    });

    it("should handle shallow merging with mixed data types and a custom sort function", () => {
      const base = { a: [3, "b", 1] };
      const next = { a: [2, "a", 4] };
      const sortFn = (x: any, y: any) => {
        if (typeof x === "number" && typeof y === "string") return -1;
        if (typeof x === "string" && typeof y === "number") return 1;
        if (typeof x === "number" && typeof y === "number") return x - y;
        if (typeof x === "string" && typeof y === "string")
          return x.localeCompare(y);
        return 0;
      };
      expect(merges.shallow(base, next, { level: 2, sort: sortFn })).toEqual({
        a: [1, 2, 3, 4, "a", "b"],
      });
    });
  });

  describe("deep", () => {
    it("should deeply merge two objects", () => {
      const base = { a: { b: 1 } };
      const next = { a: { c: 2 } };
      expect(merges.deep(base, next)).toEqual({ a: { b: 1, c: 2 } });
    });

    it("should handle array merging with a custom comparator", () => {
      const base = { a: [1, 2] };
      const next = { a: [2, 3] };
      const comparator = (x: unknown, y: unknown) => x === y;
      expect(merges.deep(base, next, { array: { comparator } })).toEqual({
        a: [1, 2, 3],
      });
    });

    it("should deeply merge nested objects with arrays", () => {
      const base = { a: { b: [1, 2], c: { d: 3 } } };
      const next = { a: { b: [2, 3], c: { e: 4 } } };
      expect(merges.deep(base, next)).toEqual({
        a: { b: [1, 2, 3], c: { d: 3, e: 4 } },
      });
    });

    it("should deeply merge objects with different data types", () => {
      const base = { a: { b: 1, c: "hello" }, d: [1, 2] };
      const next = { a: { b: 2, c: "world" }, d: [2, 3], e: true };
      expect(merges.deep(base, next)).toEqual({
        a: { b: 2, c: "world" },
        d: [1, 2, 3],
        e: true,
      });
    });

    it("should handle merging objects with undefined and null values", () => {
      const base = { a: { b: null, c: 1 }, d: undefined };
      const next = { a: { b: 2, c: undefined }, d: { e: 3 } };
      expect(merges.deep(base, next)).toEqual({
        a: { b: 2, c: undefined },
        d: { e: 3 },
      });
    });

    it("should deeply merge arrays of objects with a custom comparator", () => {
      const base = {
        a: [
          { id: 1, value: "a" },
          { id: 2, value: "b" },
        ],
      };
      const next = {
        a: [
          { id: 2, value: "c" },
          { id: 3, value: "d" },
        ],
      };
      const comparator = (x: any, y: any) => x.id === y.id;
      expect(merges.deep(base, next, { array: { comparator } })).toEqual({
        a: [
          { id: 1, value: "a" },
          { id: 2, value: "c" },
          { id: 3, value: "d" },
        ],
      });
    });

    it("should deeply merge objects with mixed primitive and object values", () => {
      const base = { a: 1, b: { c: "hello", d: [1, 2] } };
      const next = { a: { e: 2 }, b: { c: "world", d: [2, 3] } };
      expect(merges.deep(base, next)).toEqual({
        a: { e: 2 },
        b: { c: "world", d: [1, 2, 3] },
      });
    });

    it("should deeply merge objects with a custom sort function", () => {
      const base = { a: [3, 1, 2] };
      const next = { a: [6, 5, 4] };
      const sortFn = (x: number, y: number) => x - y;
      expect(merges.deep(base, next, { sort: sortFn })).toEqual({
        a: [1, 2, 3, 4, 5, 6],
      });
    });

    it("should deeply merge objects with a boolean sort parameter set to true", () => {
      const base = { a: ["z", "x", "y"] };
      const next = { a: ["b", "a", "c"] };
      expect(merges.deep(base, next, { sort: true })).toEqual({
        a: ["a", "b", "c", "x", "y", "z"],
      });
    });

    it("should deeply merge objects with a boolean sort parameter set to false", () => {
      const base = { a: ["z", "x", "y"] };
      const next = { a: ["b", "a", "c"] };
      expect(merges.deep(base, next, { sort: false })).toEqual({
        a: ["z", "x", "y", "b", "a", "c"],
      });
    });

    it("should deeply merge arrays of objects with a custom comparator and sort function", () => {
      const base = {
        a: [
          { id: 3, value: "c" },
          { id: 1, value: "a" },
        ],
      };
      const next = {
        a: [
          { id: 2, value: "b" },
          { id: 4, value: "d" },
        ],
      };
      const comparator = (x: any, y: any) => x.id === y.id;
      const sortFn = (x: any, y: any) => x.id - y.id;
      expect(
        merges.deep(base, next, { array: { comparator }, sort: sortFn }),
      ).toEqual({
        a: [
          { id: 1, value: "a" },
          { id: 2, value: "b" },
          { id: 3, value: "c" },
          { id: 4, value: "d" },
        ],
      });
    });

    it("should deeply merge objects with nested arrays and a custom sort function", () => {
      const base = { a: { b: [9, 7, 8] } };
      const next = { a: { b: [6, 5, 4] } };
      const sortFn = (x: number, y: number) => x - y;
      expect(merges.deep(base, next, { sort: sortFn })).toEqual({
        a: { b: [4, 5, 6, 7, 8, 9] },
      });
    });
  });
});
