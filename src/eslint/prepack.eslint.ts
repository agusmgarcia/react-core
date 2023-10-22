import withContext from "./withContext.eslint";

export default function prepack(): Promise<void> {
  return withContext(() => Promise.resolve());
}
