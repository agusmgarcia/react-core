import delay from "./delay";

describe("delay", () => {
  it("takes 100ms before executing next step", async () => {
    const now = Date.now();
    await delay(100);
    expect(now).toBeGreaterThanOrEqual(100);
  });
});
