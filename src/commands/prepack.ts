import run from "./_run";
import { execute, isLibrary } from "./utilities";

export default async function prepack(): Promise<void> {
  if (!(await isLibrary())) return;

  await run(
    false,
    () => execute("webpack --mode=production", true),
    () => execute("cpy README.md CHANGELOG.md ../.. --cwd=.github", true),
  );
}

prepack();
