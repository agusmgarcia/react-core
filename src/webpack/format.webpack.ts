import withContext from "./withContext.webpack";

export default function format(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
