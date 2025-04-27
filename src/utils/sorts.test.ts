import * as sorts from "./sorts";

describe("sorts", () => {
  describe("byNumberAsc", () => {
    it("should sort numbers in ascending order", () => {
      expect(sorts.byNumberAsc(1, 2)).toBe(-1);
      expect(sorts.byNumberAsc(2, 1)).toBe(1);
      expect(sorts.byNumberAsc(1, 1)).toBe(0);
    });
  });

  describe("byNumberDesc", () => {
    it("should sort numbers in descending order", () => {
      expect(sorts.byNumberDesc(1, 2)).toBe(1);
      expect(sorts.byNumberDesc(2, 1)).toBe(-1);
      expect(sorts.byNumberDesc(1, 1)).toBe(0);
    });
  });

  describe("byStringAsc", () => {
    it("should sort strings in ascending order", () => {
      expect(sorts.byStringAsc("a", "b")).toBe(-1);
      expect(sorts.byStringAsc("b", "a")).toBe(1);
      expect(sorts.byStringAsc("a", "a")).toBe(-0);
    });
  });

  describe("byStringDesc", () => {
    it("should sort strings in descending order", () => {
      expect(sorts.byStringDesc("a", "b")).toBe(1);
      expect(sorts.byStringDesc("b", "a")).toBe(-1);
      expect(sorts.byStringDesc("a", "a")).toBe(-0);
    });
  });

  describe("byBooleanAsc", () => {
    it("should sort booleans in ascending order", () => {
      expect(sorts.byBooleanAsc(true, false)).toBe(-1);
      expect(sorts.byBooleanAsc(false, true)).toBe(1);
      expect(sorts.byBooleanAsc(true, true)).toBe(0);
      expect(sorts.byBooleanAsc(false, false)).toBe(0);
    });
  });

  describe("byBooleanDesc", () => {
    it("should sort booleans in descending order", () => {
      expect(sorts.byBooleanDesc(true, false)).toBe(1);
      expect(sorts.byBooleanDesc(false, true)).toBe(-1);
      expect(sorts.byBooleanDesc(true, true)).toBe(0);
      expect(sorts.byBooleanDesc(false, false)).toBe(0);
    });
  });
});
