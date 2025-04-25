import throwError from "./throwError";

describe("throwError", () => {
  it("should throw an error when passed an Error object", () => {
    const error = new Error("Test error");
    expect(() => throwError(error)).toThrow("Test error");
  });

  it("should throw an error when passed a string message", () => {
    expect(() => throwError("Test error message")).toThrow(
      "Test error message",
    );
  });

  it("should throw an error with options when passed a string message and options", () => {
    const options = { cause: new Error("Cause error") };
    expect(() => throwError("Test error with options", options)).toThrow(
      "Test error with options",
    );
  });

  it("should throw the same error object when passed an Error object", () => {
    const error = new Error("Original error");
    try {
      throwError(error);
    } catch (e) {
      expect(e).toBe(error);
    }
  });
});
