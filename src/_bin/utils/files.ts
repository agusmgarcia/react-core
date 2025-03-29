import fs from "fs";

export function exists(path: string): Promise<boolean> {
  return new Promise<boolean>((resolve) =>
    fs.access(path, fs.constants.F_OK, (error) => resolve(!error)),
  );
}

export async function readFile(path: string): Promise<string | undefined> {
  if (!(await exists(path))) return undefined;
  return await readRequiredFile(path);
}

export function readRequiredFile(path: string): Promise<string> {
  return new Promise<string>((resolve, reject) =>
    fs.readFile(path, { encoding: "utf-8" }, (error, data) =>
      !error ? resolve(data) : reject(error),
    ),
  );
}

export function removeFile(path: string): Promise<void> {
  return new Promise((resolve, reject) =>
    fs.rm(path, { force: true, recursive: true }, (error) =>
      !error ? resolve() : reject(error),
    ),
  );
}

export async function upsertFile(
  path: string,
  data: string,
  options: { create: boolean; update: boolean } | boolean,
): Promise<void> {
  if (
    (await exists(path))
      ? typeof options === "boolean"
        ? !options
        : !options.update
      : typeof options === "boolean"
        ? !options
        : !options.create
  )
    return;

  return new Promise<void>((resolve, reject) =>
    fs.writeFile(path, data, { encoding: "utf-8", flag: "w+" }, (error) =>
      !error ? resolve() : reject(error),
    ),
  );
}
