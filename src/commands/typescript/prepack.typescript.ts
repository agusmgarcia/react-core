import withContext from "./withContext.typescript";

export default function prepack(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
