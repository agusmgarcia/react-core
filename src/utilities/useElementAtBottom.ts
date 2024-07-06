import { useEffect, useState } from "react";

export default function useElementAtBottom<TElement extends HTMLElement>(
  elementRef: React.RefObject<TElement>,
  defaultAtBottom = false,
): boolean {
  const [atBottom, setAtBottom] = useState(defaultAtBottom);

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) return;

    const handleScroll = (e: TElement): void =>
      setAtBottom(
        Math.abs(e.scrollTop - (e.scrollHeight - e.offsetHeight)) < 1,
      );

    function listen(event: Event) {
      const target = event.target;
      if (target === null) return;
      if (!("scrollBottom" in target)) return;
      if (typeof target.scrollBottom !== "number") return;
      if (!("scrollHeight" in target)) return;
      if (typeof target.scrollHeight !== "number") return;
      if (!("offsetHeight" in target)) return;
      if (typeof target.offsetHeight !== "number") return;
      handleScroll(target as TElement);
    }

    handleScroll(element);
    element.addEventListener("scroll", listen);
    return () => element.removeEventListener("scroll", listen);
  }, [elementRef]);

  return atBottom;
}
