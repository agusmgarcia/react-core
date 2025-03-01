import * as equals from "./equals";

describe("equals", () => {
  it("strictly compares two values", () => {
    expect(equals.strict(1, 1)).toBeTruthy();
    expect(equals.strict("1", "0")).not.toBeTruthy();
  });

  it("shallowly compares two values", () => {
    expect(equals.shallow({ name: "john" }, { name: "john" })).toBeTruthy();
    expect(
      equals.shallow(
        { address: { stree: "doe" }, name: "john" },
        { address: { stree: "doe" }, name: "john" },
      ),
    ).not.toBeTruthy();
  });

  it("deeply compares two values", () => {
    expect(
      equals.deep(
        { address: { street: "doe" }, name: "john" },
        { address: { street: "doe" }, name: "john" },
      ),
    ).toBeTruthy();
    expect(
      equals.deep(
        { address: { street: "foo" }, name: "john" },
        { address: { street: "doe" }, name: "john" },
      ),
    ).not.toBeTruthy();
  });
});
