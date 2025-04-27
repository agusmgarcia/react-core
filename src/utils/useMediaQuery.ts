import { useEffect, useState } from "react";

/**
 * A custom React hook that listens to a specified media query and returns a boolean
 * indicating whether the media query matches the current viewport.
 *
 * @param mediaQuery - The media query string to evaluate (e.g., "(min-width: 768px)").
 * @param initialValue - An optional initial value for the match state. Defaults to `false`.
 * @returns A boolean value indicating whether the media query matches the current viewport.
 *
 * @example
 * ```tsx
 * const isLargeScreen = useMediaQuery("(min-width: 1024px)");
 *
 * return (
 *   <div>
 *     {isLargeScreen ? "Large screen" : "Small screen"}
 *   </div>
 * );
 * ```
 */
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
