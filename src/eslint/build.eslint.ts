import withContext from "./withContext.eslint";

export default function build(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
