import withContext from "./withContext.webpack";

export default function postpack(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
