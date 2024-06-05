import withContext from "./withContext.prettier";

export default function prepack(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
