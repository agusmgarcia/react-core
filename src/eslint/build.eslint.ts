import withContext from "./withContext.eslint";

export default function build(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
