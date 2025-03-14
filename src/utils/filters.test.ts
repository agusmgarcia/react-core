import * as filters from "./filters";

describe("filters", () => {
  it("removes duplicated elements from array", () => {
    const array = [17, 6, 95, 6];
    expect(array.filter(filters.distinct)).toStrictEqual([17, 6, 95]);
  });

  it("paginates the elements from array", () => {
    const array = [17, 6, 95, 6];
    expect(array.filter(filters.paginate(1, 2))).toStrictEqual([17, 6]);
  });
});
