import withContext from "./withContext.typescript";

export default function start(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
