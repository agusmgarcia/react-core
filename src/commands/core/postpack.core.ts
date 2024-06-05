import withContext from "./withContext.core";

export default function postpack(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
