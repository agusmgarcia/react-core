import isSSR from "./isSSR";

describe("isSSR", () => {
  it("should return true when window is undefined", () => {
    const originalWindow = global.window;
    // Simulate server-side rendering
    delete (global as any).window;

    expect(isSSR()).toBe(true);

    // Restore original window
    global.window = originalWindow;
  });

  it("should return false when window is defined", () => {
    const originalWindow = global.window;
    // Simulate client-side rendering
    global.window = {} as any;

    expect(isSSR()).toBe(false);

    // Restore original window
    global.window = originalWindow;
  });
});
