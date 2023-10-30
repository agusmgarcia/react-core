import withContext from "./withContext.core";

export default function prepack(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
