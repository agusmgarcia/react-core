import * as finds from "./finds";

describe("finds", () => {
  it("gets the first element of the array", () => {
    const array = [17, 6, 95];
    expect(array.find(finds.first)).toStrictEqual(17);
  });

  it("gets the single element of the array or throw error", () => {
    const array = [17, 6, 95];
    expect(() => array.find(finds.single)).toThrow(
      new Error("There are more than one element in the array"),
    );
  });

  it("gets the single element or undefined", () => {
    const array = [17, 6, 95];
    expect(array.find(finds.singleOrDefault)).toBeUndefined();
  });
});
