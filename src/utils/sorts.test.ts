import * as sorts from "./sorts";

describe("sorts", () => {
  it("sorts the arrays based on conditions", () => {
    expect([1, 2].sort(sorts.byNumberAsc)).toStrictEqual([1, 2]);

    expect([1, 2].sort(sorts.byNumberDesc)).toStrictEqual([2, 1]);

    expect(["john", "doe"].sort(sorts.byStringAsc)).toStrictEqual([
      "doe",
      "john",
    ]);

    expect(["john", "doe"].sort(sorts.byStringDesc)).toStrictEqual([
      "john",
      "doe",
    ]);

    expect([false, true].sort(sorts.byBooleanAsc)).toStrictEqual([true, false]);

    expect([false, true].sort(sorts.byBooleanDesc)).toStrictEqual([
      false,
      true,
    ]);
  });
});
