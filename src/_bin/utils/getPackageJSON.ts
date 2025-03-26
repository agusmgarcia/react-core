import fs from "fs";

type PackageJSON = {
  author?: string;
  bin?: Record<string, string>;
  dependencies?: Record<string, string>;
  description?: string;
  devDependencies?: Record<string, string>;
  engines?: Record<string, string>;
  main?: string;
  name?: string;
  optionalDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  private?: boolean | string;
  repository?: { directory?: string; type?: string; url?: string };
  scripts?: Record<string, string>;
  types?: string;
  version?: string;
};

export default function getPackageJSON(): Promise<PackageJSON> {
  return new Promise<PackageJSON>((resolve, reject) =>
    fs.readFile("package.json", { encoding: "utf-8" }, (error, data) =>
      !error ? resolve(JSON.parse(data)) : reject(error),
    ),
  );
}
