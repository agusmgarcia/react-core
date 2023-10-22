import withContext from "./withContext.eslint";

export default function postpack(): Promise<void> {
  return withContext(() => Promise.resolve());
}
