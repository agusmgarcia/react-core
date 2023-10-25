import withContext from "./withContext.github";

export default function build(): Promise<void> {
  return withContext(() => Promise.resolve());
}
