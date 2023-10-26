import withContext from "./withContext.core";

export default function postpack(): Promise<void> {
  return withContext(() => Promise.resolve());
}
