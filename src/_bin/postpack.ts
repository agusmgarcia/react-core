import run from "./_run";
import { execute, files, getPackageJSON } from "./utils";

export default async function postpack(): Promise<void> {
  const core = await getPackageJSON().then((json) => json.core);
  if (core !== "lib") return;

  await run(
    "postpack",
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
