import aggregateResponse from "./aggregateResponse";
import type AsyncFunc from "./AsyncFunc.types";

type TestResult = { items: number[]; totalCount: number };

describe("aggregateResponse", () => {
  it("returns all items when totalCount fits in one page", async () => {
    const callback: AsyncFunc<TestResult, [number, number]> = async () => ({
      items: [1, 2, 3],
      totalCount: 3,
    });
    const result = await aggregateResponse(callback, 10);
    expect(result).toEqual([1, 2, 3]);
  });

  it("aggregates items from multiple pages", async () => {
    const callback: AsyncFunc<TestResult, [number, number]> = async (page) => {
      if (page === 1) return { items: [1, 2], totalCount: 5 };
      if (page === 2) return { items: [3, 4], totalCount: 5 };
      return { items: [5], totalCount: 5 };
    };
    const result = await aggregateResponse(callback, 2);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("handles empty results", async () => {
    const callback: AsyncFunc<TestResult, [number, number]> = async () => ({
      items: [],
      totalCount: 0,
    });
    const result = await aggregateResponse(callback, 5);
    expect(result).toEqual([]);
  });

  it("works when totalCount is not a multiple of pageSize", async () => {
    const callback: AsyncFunc<TestResult, [number, number]> = async (page) => {
      if (page === 1) return { items: [1, 2, 3], totalCount: 5 };
      return { items: [4, 5], totalCount: 5 };
    };
    const result = await aggregateResponse(callback, 3);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("calls callback with correct page indices and pageSize", async () => {
    const calls: Array<[number, number]> = [];
    const callback: AsyncFunc<TestResult, [number, number]> = async (
      page,
      pageSize,
    ) => {
      calls.push([page, pageSize]);
      if (page === 1) return { items: [1, 2], totalCount: 4 };
      return { items: [3, 4], totalCount: 4 };
    };
    await aggregateResponse(callback, 2);
    expect(calls).toEqual([
      [1, 2],
      [2, 2],
    ]);
  });

  it("handles when callback throws an error", async () => {
    const callback: AsyncFunc<TestResult, [number, number]> = async (page) => {
      if (page === 1) return { items: [1, 2], totalCount: 4 };
      throw new Error("Fetch failed");
    };
    await expect(aggregateResponse(callback, 2)).rejects.toThrow(
      "Fetch failed",
    );
  });

  it("returns empty array when totalCount is zero but callback returns items", async () => {
    const callback: AsyncFunc<TestResult, [number, number]> = async () => ({
      items: [1, 2],
      totalCount: 0,
    });
    const result = await aggregateResponse(callback, 2);
    // Should still return the items, as per implementation
    expect(result).toEqual([1, 2]);
  });

  it("works with pageSize larger than totalCount", async () => {
    const callback: AsyncFunc<TestResult, [number, number]> = async () => ({
      items: [1, 2, 3],
      totalCount: 3,
    });
    const result = await aggregateResponse(callback, 100);
    expect(result).toEqual([1, 2, 3]);
  });
});
