import { spawn } from "child_process";

import IgnorableError from "./IgnorableError";

export default function execute(
  // eslint-disable-next-line unused-imports/no-unused-vars
  command: string,
  // eslint-disable-next-line unused-imports/no-unused-vars
  disassociated: true,
): Promise<void>;

export default function execute(
  // eslint-disable-next-line unused-imports/no-unused-vars
  command: string,
  // eslint-disable-next-line unused-imports/no-unused-vars
  disassociated: false,
): Promise<string>;

export default function execute(
  command: string,
  disassociated: boolean,
): Promise<void | string> {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(" ");
    const child = spawn(cmd, args, {
      stdio: disassociated === true ? "inherit" : "pipe",
    });

    const listeners = new Array<() => void>();

    let stdout = "";
    let stderr = "";
    let error: Error | undefined = undefined;

    listeners.push(
      (function () {
        if (child.stdout === null) return emptyFunction;
        const handle = (data: Buffer) => (stdout += data.toString());
        const listener = child.stdout.on("data", handle);
        return () => listener.removeListener("data", handle);
      })(),
    );

    listeners.push(
      (function () {
        if (child.stderr === null) return emptyFunction;
        const handle = (data: Buffer) => (stderr += data.toString());
        const listener = child.stderr.on("data", handle);
        return () => listener.removeListener("data", handle);
      })(),
    );

    listeners.push(
      (function () {
        const handle = (e: Error) => (error = e);
        const listener = child.on("error", handle);
        return () => listener.removeListener("error", handle);
      })(),
    );

    listeners.push(
      (function () {
        function handle(code: number) {
          listeners.forEach((unlisten) => unlisten());
          if (code === 0) resolve(stdout !== "" ? stdout : undefined);
          else
            reject(
              stderr !== ""
                ? new Error(stderr)
                : error !== undefined
                ? error
                : new IgnorableError(),
            );
        }

        const listener = child.on("close", handle);
        return () => listener.removeListener("close", handle);
      })(),
    );
  });
}

function emptyFunction(): void {}
