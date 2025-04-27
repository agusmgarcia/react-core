/**
 * Determines if the code is being executed in a server-side rendering (SSR) environment.
 *
 * @returns {boolean} `true` if the `window` object is undefined, indicating SSR; otherwise, `false`.
 */
export default function isSSR(): boolean {
  return typeof window === "undefined";
}
