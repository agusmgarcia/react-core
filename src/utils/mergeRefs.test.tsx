import { render } from "@testing-library/react";
import { useEffect, useRef } from "react";

import type Func from "./Func.types";
import mergeRefs from "./mergeRefs";

describe("mergeRefs", () => {
  it("merges two refs and executes a callback sending back the id", () => {
    const Component = ({
      id,
      onRefs,
    }: {
      id: string;
      onRefs: Func<void, [ref1: HTMLElement, ref2: HTMLElement]>;
    }) => {
      const ref1 = useRef<HTMLDivElement>(null);
      const ref2 = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (!ref1.current || !ref2.current) return;
        onRefs(ref1.current, ref2.current);
      }, [onRefs]);

      return <div ref={mergeRefs(ref1, ref2)} id={id} />;
    };

    const onRefs = jest.fn((e1: HTMLElement, e2: HTMLElement) => [
      e1.id,
      e2.id,
    ]);

    render(<Component id="myId" onRefs={onRefs} />);
    expect(onRefs).toHaveNthReturnedWith(1, ["myId", "myId"]);
  });
});
