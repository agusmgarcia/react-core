import withContext from "./withContext.webpack";

export default function build(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
