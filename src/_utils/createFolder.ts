import fs from "fs";

export default function createFolder(path: string): Promise<void> {
  return new Promise((resolve, reject) =>
    fs.mkdir(path, undefined, (error) =>
      error === null ? resolve() : reject(error),
    ),
  );
}
