import { useEffect, useState } from "react";

import useDevicePixelRatio from "./useDevicePixelRatio";
import useDimensions from "./useDimensions";

/**
 * Custom hook that determines whether a given HTML element is scrolled to the top.
 *
 * @template TElement - The type of the HTML element being observed.
 * @param elementRef - A React ref object pointing to the target HTML element.
 * @param initialValue - An optional initial value for the `atTop` state. Defaults to `true`.
 * @returns A boolean indicating whether the element is scrolled to the top.
 *
 * @remarks
 * - This hook listens to the `scroll` event on the target element and updates the `atTop` state
 *   based on the element's `scrollTop` value.
 * - The `devicePixelRatio` is used as a threshold to determine if the element is at the top.
 * - The hook also accounts for changes in the element's dimensions by using the `useDimensions` hook.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const isAtTop = useElementAtTop(ref);
 *
 * useEffect(() => {
 *   console.log("Is at top:", isAtTop);
 * }, [isAtTop]);
 *
 * return <div ref={ref} style={{ overflow: "scroll", height: "200px" }}>Content</div>;
 * ```
 */
export default function useElementAtTop<TElement extends HTMLElement>(
  elementRef: React.RefObject<TElement | null>,
  initialValue = true,
): boolean {
  const [atTop, setAtTop] = useState(initialValue);

  const devicePixelRatio = useDevicePixelRatio();
  const dimensions = useDimensions(elementRef);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      setAtTop(initialValue);
      return;
    }

    const handle = (event: Event | { target: TElement }) => {
      const target = event.target as TElement;
      setAtTop(target.scrollTop < devicePixelRatio);
    };

    handle({ target: element });

    element.addEventListener("scroll", handle);
    return () => element.removeEventListener("scroll", handle);
  }, [dimensions, devicePixelRatio, elementRef, initialValue]);

  return atTop;
}
