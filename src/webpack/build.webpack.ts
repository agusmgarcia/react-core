import withContext from "./withContext.webpack";

export default function build(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
