import * as equals from "./equals";
import * as filters from "./filters";

describe("filters", () => {
  describe("distinct", () => {
    it("should return true for distinct elements in an array", () => {
      const array = [1, 2, 3, 4];
      const result = filters.distinct(2, 1, array);
      expect(result).toBe(true);
    });

    it("should return false for duplicate elements in an array", () => {
      const array = [1, 2, 2, 4];
      const result = filters.distinct(2, 2, array);
      expect(result).toBe(false);
    });

    it("should return a function for 'deep' comparison", () => {
      const compareFn = filters.distinct(equals.deep);
      const array = [{ id: 1 }, { id: 2 }, { id: 1 }];
      const result = array.filter((el, idx, arr) => compareFn(el, idx, arr));
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it("should return a function for 'shallow' comparison", () => {
      const compareFn = filters.distinct(equals.shallow);
      const array = [{ id: 1 }, { id: 2 }, { id: 1 }];
      const result = array.filter((el, idx, arr) => compareFn(el, idx, arr));
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it("should return a function for 'strict' comparison", () => {
      const compareFn = filters.distinct(equals.strict);
      const array = [1, 2, 2, 3];
      const result = array.filter((el, idx, arr) => compareFn(el, idx, arr));
      expect(result).toEqual([1, 2, 3]);
    });

    it("should return a function for custom comparison", () => {
      const customCompare = (a: number, b: number) => a % 2 === b % 2;
      const compareFn = filters.distinct(customCompare);
      const array = [1, 2, 3, 4, 5];
      const result = array.filter((el, idx, arr) => compareFn(el, idx, arr));
      expect(result).toEqual([1, 2]);
    });
  });

  describe("paginate", () => {
    it("should return elements for the first page", () => {
      const paginateFn = filters.paginate(1, 2);
      const array = [1, 2, 3, 4];
      const result = array.filter((el, idx, arr) => paginateFn(el, idx, arr));
      expect(result).toEqual([1, 2]);
    });

    it("should return elements for the second page", () => {
      const paginateFn = filters.paginate(2, 2);
      const array = [1, 2, 3, 4];
      const result = array.filter((el, idx, arr) => paginateFn(el, idx, arr));
      expect(result).toEqual([3, 4]);
    });

    it("should return an empty array if page index is out of range", () => {
      const paginateFn = filters.paginate(3, 2);
      const array = [1, 2, 3, 4];
      const result = array.filter((el, idx, arr) => paginateFn(el, idx, arr));
      expect(result).toEqual([]);
    });
  });
});
