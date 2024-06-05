import withContext from "./withContext.typescript";

export default function format(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
