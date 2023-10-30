import withContext from "./withContext.eslint";

export default function prepack(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
