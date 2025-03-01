import isOnlyId from "./isOnlyId";

describe("isOnlyId", () => {
  it("checks whether an element has only the id property", () => {
    const element = { id: "1" };
    expect(isOnlyId(element, "id")).toBeTruthy();
  });

  it("checks whether an element has more property although the id", () => {
    const element = { id: "1", name: "John", surname: "Doe" };
    expect(isOnlyId(element, "id")).toBeFalsy();
  });
});
