import withContext from "./withContext.core";

export default function format(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
