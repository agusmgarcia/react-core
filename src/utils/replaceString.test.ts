import replaceString from "./replaceString";

describe("replaceString", () => {
  it("should replace single placeholders with corresponding values", () => {
    const result = replaceString("Hello, ${name}!", { name: "John" });
    expect(result).toBe("Hello, John!");
  });

  it("should replace multiple placeholders with corresponding values", () => {
    const result = replaceString("Hello, ${name}! You are ${age} years old.", {
      age: 30,
      name: "John",
    });
    expect(result).toBe("Hello, John! You are 30 years old.");
  });

  it("should handle conditional replacements when the value matches", () => {
    const result = replaceString("You have ${count?one item:many items}.", {
      count: 1,
    });
    expect(result).toBe("You have one item.");
  });

  it("should handle conditional replacements when the value does not match", () => {
    const result = replaceString("You have ${count?one item:many items}.", {
      count: 2,
    });
    expect(result).toBe("You have many items.");
  });

  it("should return the original string if no replacements are provided", () => {
    const result = replaceString("Hello, ${name}!");
    expect(result).toBe("Hello, ${name}!");
  });

  it("should return the original string if the key does not exist in replacements", () => {
    const result = replaceString("Hello, ${name}!", { age: 30 });
    expect(result).toBe("Hello, ${name}!");
  });

  it("should handle boolean replacements", () => {
    const result = replaceString("Feature enabled: ${enabled}", {
      enabled: true,
    });
    expect(result).toBe("Feature enabled: true");
  });

  it("should handle undefined message", () => {
    const result = replaceString(undefined, { name: "John" });
    expect(result).toBeUndefined();
  });

  it("should handle undefined replacements", () => {
    const result = replaceString("Hello, ${name}!", undefined);
    expect(result).toBe("Hello, ${name}!");
  });

  it("should handle numeric replacements", () => {
    const result = replaceString("Your score is ${score}.", { score: 100 });
    expect(result).toBe("Your score is 100.");
  });

  it("should not replace if the conditional key is not a number", () => {
    const result = replaceString("You have ${count?one item:many items}.", {
      count: "not a number",
    });
    expect(result).toBe("You have ${count?one item:many items}.");
  });
});
