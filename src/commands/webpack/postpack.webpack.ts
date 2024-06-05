import withContext from "./withContext.webpack";

export default function postpack(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
