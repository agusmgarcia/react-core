import withContext from "./withContext.typescript";

export default function build(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
