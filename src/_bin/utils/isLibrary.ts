import getPackageJSON from "./getPackageJSON";

export default function isLibrary(): Promise<boolean> {
  return getPackageJSON().then((json) =>
    typeof json.private === "string" ? json.private !== "true" : !json.private,
  );
}
