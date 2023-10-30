import withContext from "./withContext.core";

export default function check(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
