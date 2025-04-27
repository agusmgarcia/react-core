import { useEffect, useState } from "react";

import useDevicePixelRatio from "./useDevicePixelRatio";
import useDimensions from "./useDimensions";

/**
 * Custom hook to determine if a referenced HTML element is scrolled to the bottom.
 *
 * @template TElement - The type of the HTML element being referenced.
 * @param elementRef - A React ref object pointing to the target HTML element.
 * @param initialValue - An optional initial value for the `atBottom` state. Defaults to `false`.
 * @returns A boolean indicating whether the element is scrolled to the bottom.
 *
 * @remarks
 * This hook listens to the `scroll` event on the referenced element and calculates
 * whether the element is scrolled to the bottom using the `scrollTop`, `scrollHeight`,
 * and `offsetHeight` properties. It also accounts for the device's pixel ratio to
 * handle precision issues.
 *
 * The hook depends on two custom hooks:
 * - `useDevicePixelRatio`: Retrieves the device's pixel ratio.
 * - `useDimensions`: Retrieves the dimensions of the referenced element.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const isAtBottom = useElementAtBottom(ref);
 *
 * useEffect(() => {
 *   if (isAtBottom) {
 *     console.log("Element is at the bottom!");
 *   }
 * }, [isAtBottom]);
 *
 * return <div ref={ref}>Scrollable content...</div>;
 * ```
 */
export default function useElementAtBottom<TElement extends HTMLElement>(
  elementRef: React.RefObject<TElement | null>,
  initialValue = false,
): boolean {
  const [atBottom, setAtBottom] = useState(initialValue);

  const devicePixelRatio = useDevicePixelRatio();
  const dimensions = useDimensions(elementRef);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      setAtBottom(initialValue);
      return;
    }

    function handle(event: Event | { target: TElement }) {
      const target = event.target as TElement;
      setAtBottom(
        Math.abs(
          target.scrollTop - (target.scrollHeight - target.offsetHeight),
        ) < devicePixelRatio,
      );
    }

    handle({ target: element });

    element.addEventListener("scroll", handle);
    return () => element.removeEventListener("scroll", handle);
  }, [devicePixelRatio, dimensions, elementRef, initialValue]);

  return atBottom;
}
