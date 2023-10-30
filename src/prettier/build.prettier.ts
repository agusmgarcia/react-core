import withContext from "./withContext.prettier";

export default function build(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
