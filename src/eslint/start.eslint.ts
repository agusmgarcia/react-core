import withContext from "./withContext.eslint";

export default function start(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
