import withContext from "./withContext.prettier";

export default function postpack(force: boolean): Promise<void> {
  return withContext(() => Promise.resolve(), force);
}
