import run from "./_run";
import { execute, files, getCore } from "./utils";

export default async function postpack(): Promise<void> {
  if ((await getCore()) !== "lib") return;

  await run(
    "postpack",
    false,
    () => execute(`del bin dist README.md CHANGELOG.md`, true),
    () => restorePackageJSON(),
  );
}

async function restorePackageJSON() {
  if (!(await files.exists("node_modules/.packagejsoncache"))) return;

  await execute(
    "cpy .packagejsoncache ../.. --cwd=node_modules --rename=package.json",
    true,
  );

  await execute("del node_modules/.packagejsoncache", true);
}

postpack();
