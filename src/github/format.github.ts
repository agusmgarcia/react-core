import withContext from "./withContext.github";

export default function format(): Promise<void> {
  return withContext(() => Promise.resolve());
}
