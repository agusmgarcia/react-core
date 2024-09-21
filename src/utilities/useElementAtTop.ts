import { useEffect, useState } from "react";

export default function useElementAtTop<TElement extends HTMLElement>(
  elementRef: React.RefObject<TElement>,
  initialValue = true,
): boolean {
  const [atTop, setAtTop] = useState(initialValue);
  const [resize, setResize] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) return;

    const set = (e: TElement): void => setAtTop(e.scrollTop < 1);

    function handle(event: Event) {
      const target = event.target;
      if (target === null) return;
      if (!("scrollTop" in target)) return;
      if (typeof target.scrollTop !== "number") return;
      set(target as TElement);
    }

    set(element);

    element.addEventListener("scroll", handle);
    return () => element.removeEventListener("scroll", handle);
  }, [elementRef, resize]);

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) return;

    const observer = new ResizeObserver(() => setResize((prev) => !prev));
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [elementRef]);

  return atTop;
}
