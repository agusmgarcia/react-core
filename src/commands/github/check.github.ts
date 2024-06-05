import withContext from "./withContext.github";

export default function check(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
