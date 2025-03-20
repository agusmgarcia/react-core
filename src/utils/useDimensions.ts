import { useEffect, useState } from "react";

type Dimensions = { height: number; width: number };

const initialDimensions: Dimensions = { height: 0, width: 0 };

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
