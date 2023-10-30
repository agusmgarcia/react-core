import withContext from "./withContext.webpack";

export default function check(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
