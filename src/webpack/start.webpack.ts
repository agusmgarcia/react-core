import withContext from "./withContext.webpack";

export default function start(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
