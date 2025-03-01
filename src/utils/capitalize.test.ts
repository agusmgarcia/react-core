import capitalize from "./capitalize";

describe("capitalize", () => {
  it("capitalizes the input", () => {
    expect(capitalize("john")).toStrictEqual("John");
    expect(capitalize("Doe")).toStrictEqual("Doe");
  });
});
