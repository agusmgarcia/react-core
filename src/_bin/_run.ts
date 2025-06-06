import { Mutex } from "async-mutex";

import { type AsyncFunc } from "#src/utils";

import * as middlewares from "./middlewares";
import { args } from "./utils";

export default async function run(
  command:
    | "build"
    | "check"
    | "deploy"
    | "format"
    | "postpack"
    | "prepack"
    | "regenerate"
    | "start"
    | "test",
  regenerate: boolean,
  ...commands: AsyncFunc[]
): Promise<void> {
  const mutex: Mutex = ((globalThis as any).__AGUSMGARCIA__RUN__MUTEX__ ||=
    new Mutex());

  const force = args.has("force");
  const ignore = args.get("ignore");

  await mutex.runExclusive(async () => {
    const middleware = concat(
      command,
      regenerate ? (force ? "hard" : "soft") : undefined,
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
  command: string,
  regenerate: "hard" | "soft" | undefined,
  ignore: string[],
  ...middlewares: AsyncFunc<
    void,
    [
      _: string,
      next: AsyncFunc,
      regenerate: "hard" | "soft" | undefined,
      ignore: string[],
    ]
  >[]
): AsyncFunc<void, [callback: AsyncFunc]> {
  return function (callback) {
    let result = callback;

    for (let i = middlewares.length - 1; i >= 0; i--) {
      const middleware = middlewares[i];
      result = middleware.bind(undefined, command, result, regenerate, ignore);
    }

    return result();
  };
}
