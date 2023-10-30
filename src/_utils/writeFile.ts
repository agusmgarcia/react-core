import fs from "fs";

import exists from "./exists";

export default async function writeFile(
  path: string,
  data: string,
  force: boolean,
): Promise<void> {
  if (!force) if (await exists(path)) return;

  return await new Promise((resolve, reject) =>
    fs.writeFile(path, data, { encoding: "utf-8" }, (error) =>
      error === null ? resolve() : reject(error),
    ),
  );
}
