import withContext from "./withContext.github";

export default function format(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
