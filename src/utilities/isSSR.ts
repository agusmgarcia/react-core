export default function isSSR(): boolean {
  return typeof window === "undefined";
}
