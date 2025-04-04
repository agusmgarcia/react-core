import { Mutex } from "async-mutex";

import { type AsyncFunc } from "#src/utils";

import * as middlewares from "./middlewares";
import { args } from "./utils";

export default async function run(
  regenerate: boolean,
  ...commands: AsyncFunc[]
): Promise<void> {
  const mutex: Mutex = ((globalThis as any).__AGUSMGARCIA__RUN__MUTEX__ ||=
    new Mutex());

  await mutex.runExclusive(async () => {
    const ignore = args.get("ignore");

    const middleware = concat(
      regenerate,
      ignore,
      ...Object.values(middlewares),
    );

    await middleware(async () => {
      try {
        for (const cmd of commands) await cmd();
      } catch (error: any) {
        if (error.ignorable !== true) console.error(error);
      }
    });
  });
}

function concat(
  regenerate: boolean,
  ignore: string[],
  ...middlewares: AsyncFunc<
    void,
    [next: AsyncFunc, regenerate: boolean, ignore: string[]]
  >[]
): AsyncFunc<void, [callback: AsyncFunc]> {
  return function (callback) {
    let result = callback;

    for (let i = middlewares.length - 1; i >= 0; i--) {
      const middleware = middlewares[i];
      result = middleware.bind(undefined, result, regenerate, ignore);
    }

    return result();
  };
}
