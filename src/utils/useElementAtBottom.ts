import { useEffect, useState } from "react";

import useDevicePixelRatio from "./useDevicePixelRatio";
import useDimensions from "./useDimensions";

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
