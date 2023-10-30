import withContext from "./withContext.typescript";

export default function postpack(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
