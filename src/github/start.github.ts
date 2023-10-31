import withContext from "./withContext.github";

export default function start(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
