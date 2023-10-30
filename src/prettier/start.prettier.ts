import withContext from "./withContext.prettier";

export default function start(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
