import { useEffect, useState } from "react";

export default function useElementAtTop<TElement extends HTMLElement>(
  elementRef: React.RefObject<TElement>,
  defaultAtTop = true,
): boolean {
  const [atTop, setAtTop] = useState(defaultAtTop);

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) return;

    const handleScroll = (e: TElement): void => setAtTop(e.scrollTop === 0);

    function listen(event: Event) {
      const target = event.target;
      if (target === null) return;
      if (!("scrollTop" in target)) return;
      if (typeof target.scrollTop !== "number") return;
      handleScroll(target as TElement);
    }

    handleScroll(element);
    element.addEventListener("scroll", listen);
    return () => element.removeEventListener("scroll", listen);
  }, [elementRef]);

  return atTop;
}
