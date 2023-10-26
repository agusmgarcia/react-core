import withContext from "./withContext.core";

export default function check(): Promise<void> {
  return withContext(() => Promise.resolve());
}
