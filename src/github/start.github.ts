import withContext from "./withContext.github";

export default function start(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
