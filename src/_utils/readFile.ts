import fs from "fs";

export default function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) =>
    fs.readFile(path, { encoding: "utf-8" }, (error, data) =>
      error === null ? resolve(data) : reject(error),
    ),
  );
}
