import withContext from "./withContext.webpack";

export default function check(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
