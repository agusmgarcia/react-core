import withContext from "./withContext.typescript";

export default function build(): Promise<void> {
  return withContext(() => Promise.resolve());
}
