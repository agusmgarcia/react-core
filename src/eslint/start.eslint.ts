import withContext from "./withContext.eslint";

export default function start(): Promise<void> {
  return withContext(() => Promise.resolve());
}
