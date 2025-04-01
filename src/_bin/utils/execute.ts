import { spawn } from "child_process";

import { type Func } from "#src/utils";

export default function execute(
  command: string,
  disassociated: true,
  options?: { excludeQuotes?: boolean },
): Promise<void>;

export default function execute(
  command: string,
  disassociated: false,
  options?: { excludeQuotes?: boolean },
): Promise<string>;

export default function execute(
  command: string,
  disassociated: boolean,
  options?: { excludeQuotes?: boolean },
): Promise<void | string> {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = parseCommandAndArgs(
      command,
      !!options?.excludeQuotes,
    );

    const child = spawn(cmd, args, {
      shell: process.platform === "win32" ? true : undefined,
      stdio: disassociated === true ? "inherit" : "pipe",
    });

    const listeners = new Array<Func>();

    let stdout = "";
    let stderr = "";
    let error: Error | undefined = undefined;

    listeners.push(
      (function () {
        if (!child.stdout) return emptyFunction;
        const handle = (data: Buffer) => (stdout += data.toString());
        const listener = child.stdout.on("data", handle);
        return () => listener.removeListener("data", handle);
      })(),
    );

    listeners.push(
      (function () {
        if (!child.stderr) return emptyFunction;
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
          if (!code) resolve(!!stdout ? stdout : undefined);
          else
            reject(
              !!stderr
                ? new Error(stderr)
                : !!error
                  ? error
                  : { ignorable: true },
            );
        }

        const listener = child.on("close", handle);
        return () => listener.removeListener("close", handle);
      })(),
    );
  });
}

function parseCommandAndArgs(
  command: string,
  excludeQuotes: boolean,
): string[] {
  const result = new Array<string>();

  let element = "";
  let doubleQuotesEncountered = false;

  for (let i = 0; i < command.length; i++) {
    const char = command[i];

    if (char === " " && !doubleQuotesEncountered) {
      if (!!element) {
        result.push(element);
        element = "";
      }
      continue;
    }

    if (char === '"') {
      doubleQuotesEncountered = !doubleQuotesEncountered;
      if (!excludeQuotes) element += char;
      continue;
    }

    element += char;
  }

  if (!!element) result.push(element);

  return result;
}

function emptyFunction(): void {}
