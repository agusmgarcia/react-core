import fs from "fs";

type PackageJSON = {
  name?: string;
  private?: boolean | string;
  version?: string;
};

export default function getPackageJSON(): Promise<PackageJSON> {
  return new Promise<PackageJSON>((resolve, reject) =>
    fs.readFile("package.json", { encoding: "utf-8" }, (error, data) =>
      !error ? resolve(JSON.parse(data)) : reject(error),
    ),
  );
}
