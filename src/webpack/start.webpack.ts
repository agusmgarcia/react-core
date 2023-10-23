import withContext from "./withContext.webpack";

export default function start(): Promise<void> {
  return withContext(() => Promise.resolve());
}
