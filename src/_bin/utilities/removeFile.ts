import fs from "fs";

export default function removeFile(path: string): Promise<void> {
  return new Promise((resolve, reject) =>
    fs.rm(path, { force: true, recursive: true }, (error) =>
      error === null ? resolve() : reject(error),
    ),
  );
}
