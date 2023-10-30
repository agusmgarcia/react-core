import withContext from "./withContext.github";

export default function build(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
