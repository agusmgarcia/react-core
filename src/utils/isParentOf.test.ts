import isParentOf from "./isParentOf";

describe("isParentOf", () => {
  it("should return false if parent is null", () => {
    const child = document.createElement("div");
    expect(isParentOf(child, null)).toBe(false);
  });

  it("should return false if child is null", () => {
    const parent = document.createElement("div");
    expect(isParentOf(null, parent)).toBe(false);
  });

  it("should return true if parent is a direct parent of child", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    parent.appendChild(child);
    expect(isParentOf(child, parent)).toBe(true);
  });

  it("should return true if parent is an ancestor of child", () => {
    const grandparent = document.createElement("div");
    const parent = document.createElement("div");
    const child = document.createElement("div");
    grandparent.appendChild(parent);
    parent.appendChild(child);
    expect(isParentOf(child, grandparent)).toBe(true);
  });

  it("should return false if parent is not an ancestor of child", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    expect(isParentOf(child, parent)).toBe(false);
  });

  it("should return false if child and parent are the same node", () => {
    const node = document.createElement("div");
    expect(isParentOf(node, node)).toBe(false);
  });
});
