import fs from "fs";

export default function isLibrary(): Promise<boolean> {
  return new Promise<string>((resolve, reject) =>
    fs.readFile("package.json", { encoding: "utf-8" }, (error, data) =>
      error === null ? resolve(data) : reject(error),
    ),
  )
    .then(JSON.parse)
    .then((json) => json.private === undefined || json.private === false);
}
