import withContext from "./withContext.webpack";

export default function format(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
