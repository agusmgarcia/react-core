import isSSR from "./isSSR";

describe("isSSR", () => {
  it("checks whether there is a server or client context", () => {
    expect(isSSR()).toBeFalsy();
  });
});
