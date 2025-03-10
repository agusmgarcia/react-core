import { useEffect, useState } from "react";

export default function useElementAtBottom<TElement extends HTMLElement>(
  elementRef: React.RefObject<TElement>,
  initialValue = false,
): boolean {
  const [atBottom, setAtBottom] = useState(initialValue);
  const [resize, setResize] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const set = (e: TElement): void =>
      setAtBottom(
        Math.abs(e.scrollTop - (e.scrollHeight - e.offsetHeight)) <
          window.devicePixelRatio,
      );

    function handle(event: Event) {
      const target = event.target;
      if (!target) return;
      if (!("scrollTop" in target)) return;
      if (typeof target.scrollTop !== "number") return;
      if (!("scrollHeight" in target)) return;
      if (typeof target.scrollHeight !== "number") return;
      if (!("offsetHeight" in target)) return;
      if (typeof target.offsetHeight !== "number") return;
      set(target as TElement);
    }

    set(element);

    element.addEventListener("scroll", handle);
    return () => element.removeEventListener("scroll", handle);
  }, [elementRef, resize]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => setResize((prev) => !prev));
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [elementRef]);

  return atBottom;
}
