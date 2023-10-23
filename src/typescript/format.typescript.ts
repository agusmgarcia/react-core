import withContext from "./withContext.typescript";

export default function format(): Promise<void> {
  return withContext(() => Promise.resolve());
}
