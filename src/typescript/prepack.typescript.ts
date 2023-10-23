import withContext from "./withContext.typescript";

export default function prepack(): Promise<void> {
  return withContext(() => Promise.resolve());
}
