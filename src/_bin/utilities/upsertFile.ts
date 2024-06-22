import fs from "fs";

import exists from "./exists";

export default async function upsertFile(
  path: string,
  data: string,
  override: boolean,
): Promise<void> {
  if ((await exists(path)) && !override) return;

  return new Promise<void>((resolve, reject) =>
    fs.writeFile(path, data, { encoding: "utf-8", flag: "w+" }, (error) =>
      error === null ? resolve() : reject(error),
    ),
  );
}
