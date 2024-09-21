import { useEffect, useState } from "react";

import isParentOf from "./isParentOf";

/**
 * @deprecated This method is going to be deleted in the next major version.
 */
export default function useFocusTracker<TElement extends Element>(
  elementRef: React.RefObject<TElement>,
  defaultFocus = false,
): boolean {
  const [focus, setFocus] = useState(defaultFocus);

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) return;

    const handle = () => setFocus(true);

    element.addEventListener("focusin", handle);
    return () => element.removeEventListener("focusin", handle);
  }, [elementRef]);

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) return;

    const handle = () => setFocus(false);

    element.addEventListener("focusout", handle);
    return () => element.removeEventListener("focusout", handle);
  }, [elementRef]);

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) return;

    setFocus(
      element === document.activeElement ||
        isParentOf(document.activeElement, element),
    );
  }, [elementRef]);

  return focus;
}
