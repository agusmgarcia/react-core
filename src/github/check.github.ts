import withContext from "./withContext.github";

export default function check(): Promise<void> {
  return withContext(() => Promise.resolve());
}
