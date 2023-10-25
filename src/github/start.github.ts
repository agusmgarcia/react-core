import withContext from "./withContext.github";

export default function start(): Promise<void> {
  return withContext(() => Promise.resolve());
}
