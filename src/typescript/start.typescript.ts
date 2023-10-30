import withContext from "./withContext.typescript";

export default function start(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
