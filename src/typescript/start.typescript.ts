import withContext from "./withContext.typescript";

export default function start(): Promise<void> {
  return withContext(() => Promise.resolve());
}
