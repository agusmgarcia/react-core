import isParentOf from "./isParentOf";

describe("isParentOf", () => {
  it("checks whether an element is parent of another one", () => {
    const child = document.createElement("div");

    const parent = document.createElement("div");
    parent.appendChild(child);

    expect(isParentOf(child, parent)).toBeTruthy();
    expect(isParentOf(parent, child)).toBeFalsy();
  });
});
