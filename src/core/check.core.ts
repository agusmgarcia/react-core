import withContext from "./withContext.core";

export default function check(options: { skip: string[] }): Promise<void> {
  return withContext(() => Promise.resolve(), options);
}
