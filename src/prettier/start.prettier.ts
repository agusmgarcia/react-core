import withContext from "./withContext.prettier";

export default function start(): Promise<void> {
  return withContext(() => Promise.resolve());
}
