import withContext from "./withContext.typescript";

export default function postpack(): Promise<void> {
  return withContext(() => Promise.resolve());
}
