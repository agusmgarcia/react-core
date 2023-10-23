import withContext from "./withContext.webpack";

export default function check(): Promise<void> {
  return withContext(() => Promise.resolve());
}
