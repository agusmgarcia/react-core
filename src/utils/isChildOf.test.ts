import isChildOf from "./isChildOf";

describe("isChildOf", () => {
  it("should return true if the node is a child of the parent", () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.appendChild(child);
    expect(isChildOf(parent, child)).toBe(true);
  });

  it("should return false if the node is not a child of the parent", () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");
    expect(isChildOf(parent, child)).toBe(false);
  });

  it("should return false if the parent is null", () => {
    const child = document.createElement("span");
    expect(isChildOf(null, child)).toBe(false);
  });

  it("should return false if the child is null", () => {
    const parent = document.createElement("div");
    expect(isChildOf(parent, null)).toBe(false);
  });

  it("should return false if both parent and child are null", () => {
    expect(isChildOf(null, null)).toBe(false);
  });
});
