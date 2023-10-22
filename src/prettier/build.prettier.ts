import withContext from "./withContext.prettier";

export default function build(): Promise<void> {
  return withContext(() => Promise.resolve());
}
