import * as files from "./files";

type PackageJSON = {
  author?: string;
  bin?: Record<string, string>;
  core?: "app" | "azure-func" | "lib" | "node";
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
  return files
    .readRequiredFile("package.json")
    .then((data) => JSON.parse(data));
}
