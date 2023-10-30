import withContext from "./withContext.core";

export default function postpack(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
