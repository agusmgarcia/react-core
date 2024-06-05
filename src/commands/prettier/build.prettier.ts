import withContext from "./withContext.prettier";

export default function build(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
