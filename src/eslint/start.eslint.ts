import withContext from "./withContext.eslint";

export default function start(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
