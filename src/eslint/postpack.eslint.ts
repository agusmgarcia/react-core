import withContext from "./withContext.eslint";

export default function postpack(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
