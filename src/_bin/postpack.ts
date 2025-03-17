import run from "./_run";
import { execute, isLibrary } from "./utils";

export default async function postpack(): Promise<void> {
  if (!(await isLibrary())) return;
  await run(false, () => execute(`del bin dist README.md CHANGELOG.md`, true));
}

postpack();
