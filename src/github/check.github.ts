import withContext from "./withContext.github";

export default function check(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
