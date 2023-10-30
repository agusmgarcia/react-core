import withContext from "./withContext.core";

export default function format(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
