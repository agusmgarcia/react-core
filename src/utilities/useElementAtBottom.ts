import { useEffect, useState } from "react";

export default function useElementAtBottom<TElement extends HTMLElement>(
  elementRef: React.RefObject<TElement>,
  defaultAtBottom = false,
): boolean {
  const [atBottom, setAtBottom] = useState(defaultAtBottom);

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) return;

    const set = (e: TElement): void =>
      setAtBottom(
        Math.abs(e.scrollTop - (e.scrollHeight - e.offsetHeight)) < 1,
      );

    function handle(event: Event) {
      const target = event.target;
      if (target === null) return;
      if (!("scrollBottom" in target)) return;
      if (typeof target.scrollBottom !== "number") return;
      if (!("scrollHeight" in target)) return;
      if (typeof target.scrollHeight !== "number") return;
      if (!("offsetHeight" in target)) return;
      if (typeof target.offsetHeight !== "number") return;
      set(target as TElement);
    }

    set(element);

    element.addEventListener("scroll", handle);
    return () => element.removeEventListener("scroll", handle);
  }, [elementRef]);

  return atBottom;
}
