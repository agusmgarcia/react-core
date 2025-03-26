import run from "./_run";
import { execute, getCore } from "./utils";

export default async function prepack(): Promise<void> {
  if ((await getCore()) !== "lib") return;

  await run(
    false,
    () => execute("del bin dist *.tgz README.md CHANGELOG.md", true),
    () => execute("webpack --mode=production", true),
    () => execute("cpy README.md CHANGELOG.md ../.. --cwd=.github", true),
  );
}

prepack();
