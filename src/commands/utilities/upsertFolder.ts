import fs from "fs";

import exists from "./exists";

export default async function upsertFolder(path: string): Promise<void> {
  if (await exists(path)) return;

  await new Promise<void>((resolve, reject) =>
    fs.mkdir(path, { recursive: false }, (error) =>
      error === null ? resolve() : reject(error),
    ),
  );
}
