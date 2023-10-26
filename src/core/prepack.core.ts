import withContext from "./withContext.core";

export default function prepack(): Promise<void> {
  return withContext(() => Promise.resolve());
}
