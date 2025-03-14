import { useEffect, useState } from "react";

import useDevicePixelRatio from "./useDevicePixelRatio";
import useDimensions from "./useDimensions";

export default function useElementAtTop<TElement extends HTMLElement>(
  elementRef: React.RefObject<TElement>,
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
