import withContext from "./withContext.webpack";

export default function start(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
