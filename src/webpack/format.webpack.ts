import withContext from "./withContext.webpack";

export default function format(): Promise<void> {
  return withContext(() => Promise.resolve());
}
