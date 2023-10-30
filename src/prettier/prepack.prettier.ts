import withContext from "./withContext.prettier";

export default function prepack(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
