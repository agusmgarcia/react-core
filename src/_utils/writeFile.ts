import fs from "fs";

export default function writeFile(path: string, data: string): Promise<void> {
  return new Promise((resolve, reject) =>
    fs.writeFile(path, data, { encoding: "utf-8" }, (error) =>
      error === null ? resolve() : reject(error),
    ),
  );
}
