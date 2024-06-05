import withContext from "./withContext.prettier";

export default function postpack(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
