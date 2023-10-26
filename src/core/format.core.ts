import withContext from "./withContext.core";

export default function format(): Promise<void> {
  return withContext(() => Promise.resolve());
}
