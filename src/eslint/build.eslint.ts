import withContext from "./withContext.eslint";

export default function build(): Promise<void> {
  return withContext(() => Promise.resolve());
}
