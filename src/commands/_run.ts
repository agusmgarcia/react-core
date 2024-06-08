import { type Func } from "../utilities";
import * as middlewares from "./middlewares";

export default async function run(
  regenerate: boolean,
  ...commands: Func<[Promise<void>]>[]
): Promise<void> {
  const ignore = process.argv
    .filter((flag) => flag.startsWith("--ignore="))
    .map((skips) => skips.replace("--ignore=", "").replace(/\s/g, ""))
    .flatMap((skips) => skips.split(","));

  const middleware = concat(regenerate, ignore, ...Object.values(middlewares));

  await middleware(async () => {
    try {
      for (const cmd of commands) await cmd();
    } catch (error: any) {
      if (error.ignorable !== true) console.error(error);
    }
  });
}

function concat(
  regenerate: boolean,
  ignore: string[],
  ...middlewares: Func<
    [
      next: Func<[Promise<void>]>,
      regenerate: boolean,
      ignore: string[],
      Promise<void>,
    ]
  >[]
): Func<[callback: Func<[Promise<void>]>, Promise<void>]> {
  return function (callback) {
    let result = callback;

    for (let i = middlewares.length - 1; i >= 0; i--) {
      const middleware = middlewares[i];
      result = middleware.bind(undefined, result, regenerate, ignore);
    }

    return result();
  };
}
