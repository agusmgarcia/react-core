import withContext from "./withContext.webpack";

export default function build(): Promise<void> {
  return withContext(() => Promise.resolve());
}
