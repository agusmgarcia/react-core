import getPackageJSON from "./getPackageJSON";

export default function isLibrary(): Promise<boolean> {
  return getPackageJSON().then((json) => !json.private);
}
