import withContext from "./withContext.typescript";

export default function format(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
