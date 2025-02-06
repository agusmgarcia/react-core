import fs from "fs";

export function exists(path: string): Promise<boolean> {
  return new Promise<boolean>((resolve) =>
    fs.access(path, fs.constants.F_OK, (error) => resolve(error === null)),
  );
}

export function removeFolder(path: string): Promise<void> {
  return new Promise((resolve, reject) =>
    fs.rm(path, { force: true, recursive: true }, (error) =>
      error === null ? resolve() : reject(error),
    ),
  );
}

export async function upsertFolder(path: string): Promise<void> {
  if (await exists(path)) return;

  await new Promise<void>((resolve, reject) =>
    fs.mkdir(path, { recursive: false }, (error) =>
      error === null ? resolve() : reject(error),
    ),
  );
}
