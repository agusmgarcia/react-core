import withContext from "./withContext.prettier";

export default function start(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
