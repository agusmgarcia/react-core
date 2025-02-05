import fs from "fs";

import exists from "./exists";

export default async function upsertFile(
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
      error === null ? resolve() : reject(error),
    ),
  );
}
