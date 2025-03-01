import isChildOf from "./isChildOf";

describe("isChildOf", () => {
  it("checks whether an element is child of another one", () => {
    const child = document.createElement("div");

    const parent = document.createElement("div");
    parent.appendChild(child);

    expect(isChildOf(parent, child)).toBeTruthy();
    expect(isChildOf(child, parent)).toBeFalsy();
  });
});
