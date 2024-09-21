import { useEffect, useState } from "react";

export default function useMediaQuery(
  mediaQuery: string,
  initialValue = false,
): boolean {
  const [matches, setMatches] = useState(initialValue);

  useEffect(() => {
    const list = window.matchMedia(mediaQuery);
    setMatches(list.matches);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener("change", handler);
    return () => list.removeEventListener("change", handler);
  }, [mediaQuery]);

  return matches;
}
