import replaceString from "./replaceString";

describe("replaceString", () => {
  it("takes the string as input and replaces it with provided values", () => {
    expect(
      replaceString("This is the ${value} test", { value: "third" }),
    ).toStrictEqual("This is the third test");

    expect(
      replaceString("${nights} ${nights?night:nights}", { nights: 1 }),
    ).toStrictEqual("1 night");

    expect(
      replaceString("${nights} ${nights?night:nights}", { nights: 2 }),
    ).toStrictEqual("2 nights");
  });
});
