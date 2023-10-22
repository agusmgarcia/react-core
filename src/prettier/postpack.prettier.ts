import withContext from "./withContext.prettier";

export default function postpack(): Promise<void> {
  return withContext(() => Promise.resolve());
}
