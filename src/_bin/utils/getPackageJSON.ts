import * as files from "./files";

type PackageJSON = {
  name?: string;
  private?: boolean | string;
  version?: string;
};

export default function getPackageJSON(): Promise<PackageJSON> {
  return files
    .readRequiredFile("package.json")
    .then((data) => JSON.parse(data));
}
