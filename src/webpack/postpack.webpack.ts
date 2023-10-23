import withContext from "./withContext.webpack";

export default function postpack(): Promise<void> {
  return withContext(() => Promise.resolve());
}
