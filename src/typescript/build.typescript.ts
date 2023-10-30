import withContext from "./withContext.typescript";

export default function build(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
