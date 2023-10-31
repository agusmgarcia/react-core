import withContext from "./withContext.eslint";

export default function prepack(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
