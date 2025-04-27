import "@testing-library/jest-dom";

import { render } from "@testing-library/react";

import mergeRefs from "./mergeRefs";

describe("mergeRefs", () => {
  it("should merge multiple refs correctly", () => {
    const ref1 = { current: null };
    const ref2 = { current: null };

    const TestComponent = () => <div ref={mergeRefs(ref1, ref2)}>Test</div>;

    const { getByText } = render(<TestComponent />);
    const element = getByText("Test");

    expect(ref1.current).toBe(element);
    expect(ref2.current).toBe(element);
  });

  it("should handle null refs gracefully", () => {
    const ref1 = { current: null };

    const TestComponent = () => <div ref={mergeRefs(ref1, null)}>Test</div>;

    const { getByText } = render(<TestComponent />);
    const element = getByText("Test");

    expect(ref1.current).toBe(element);
  });

  it("should not throw if no refs are provided", () => {
    const TestComponent = () => <div ref={mergeRefs()}>Test</div>;

    const { getByText } = render(<TestComponent />);
    const element = getByText("Test");

    expect(element).toBeInTheDocument();
  });
});
