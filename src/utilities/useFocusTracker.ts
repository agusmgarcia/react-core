import { useEffect, useState } from "react";

import isParentOf from "./isParentOf";

export default function useFocusTracker<TElement extends Element>(
  elementRef: React.RefObject<TElement>,
  defaultFocus = false,
): boolean {
  const [focus, setFocus] = useState(defaultFocus);

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) return;

    const handle = () =>
      setFocus(
        element === document.activeElement ||
          isParentOf(document.activeElement, element),
      );

    handle();

    element.addEventListener("focusin", handle);
    element.addEventListener("focusout", handle);
    return () => {
      element.removeEventListener("focusout", handle);
      element.removeEventListener("focusin", handle);
    };
  }, [elementRef]);

  return focus;
}
