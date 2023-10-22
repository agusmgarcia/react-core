import fs from "fs";

export default function exists(path: string): Promise<boolean> {
  return new Promise((resolve) =>
    fs.access(path, fs.constants.F_OK, (error) => resolve(error === null)),
  );
}
