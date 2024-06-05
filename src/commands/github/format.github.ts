import withContext from "./withContext.github";

export default function format(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
