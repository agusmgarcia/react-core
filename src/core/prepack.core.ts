import withContext from "./withContext.core";

export default function prepack(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
