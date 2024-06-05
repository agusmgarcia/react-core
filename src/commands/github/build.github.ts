import withContext from "./withContext.github";

export default function build(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
