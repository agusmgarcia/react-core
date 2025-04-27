import { useEffect, useState } from "react";

/**
 * A custom React hook that observes and retrieves the dimensions (height and width)
 * of a referenced DOM element using the ResizeObserver API.
 *
 * @template TElement - The type of the DOM element being observed.
 *
 * @param elementRef - A React ref object pointing to the DOM element whose dimensions
 * need to be observed. The ref should be created using `React.useRef`.
 *
 * @param initialValue - An optional initial value for the dimensions. Defaults to
 * `{ height: 0, width: 0 }`.
 *
 * @param options - An optional parameter specifying the `box` option for the
 * ResizeObserver. This determines which box model to observe (e.g., `content-box`,
 * `border-box`).
 *
 * @returns An object containing the current dimensions of the observed element:
 * - `height`: The height of the element.
 * - `width`: The width of the element.
 *
 * @example
 * ```tsx
 * import React, { useRef } from "react";
 * import useDimensions from "./useDimensions";
 *
 * const MyComponent = () => {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const dimensions = useDimensions(ref);
 *
 *   return (
 *     <div ref={ref}>
 *       <p>Height: {dimensions.height}px</p>
 *       <p>Width: {dimensions.width}px</p>
 *     </div>
 *   );
 * };
 * ```
 */
export default function useDimensions<TElement extends Element>(
  elementRef: React.RefObject<TElement | null>,
  initialValue = initialDimensions,
  options?: ResizeObserverOptions["box"],
): Dimensions {
  const [visible, setVisible] = useState(false);

  const [dimensions, setDimensions] = useState(initialValue);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setVisible(!!elementRef.current);
  });

  useEffect(() => {
    if (!visible) {
      setDimensions(initialValue);
      return;
    }

    const element = elementRef.current;
    if (!element) {
      setDimensions(initialValue);
      return;
    }

    const observer = new ResizeObserver((entries) =>
      setDimensions({
        height: entries[0].contentRect.height,
        width: entries[0].contentRect.width,
      }),
    );

    observer.observe(element, { box: options });
    return () => observer.unobserve(element);
  }, [options, elementRef, visible, initialValue]);

  return dimensions;
}

type Dimensions = { height: number; width: number };

const initialDimensions: Dimensions = { height: 0, width: 0 };
