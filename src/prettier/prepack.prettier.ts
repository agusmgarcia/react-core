import withContext from "./withContext.prettier";

export default function prepack(): Promise<void> {
  return withContext(() => Promise.resolve());
}
