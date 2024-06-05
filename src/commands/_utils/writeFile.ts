import fs from "fs";

export default async function writeFile(
  path: string,
  data: string,
  skip: boolean,
): Promise<void> {
  if (skip) return;

  return await new Promise((resolve, reject) =>
    fs.writeFile(path, data, { encoding: "utf-8" }, (error) =>
      error === null ? resolve() : reject(error),
    ),
  );
}
