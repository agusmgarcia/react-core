import run from "./_run";
import { args, execute, files, getCore, getPackageJSON } from "./utils";

export default async function prepack(): Promise<void> {
  if ((await getCore()) !== "lib") return;

  const includeNode = args.has("include-node");
  await run(
    "prepack",
    false,
    () => execute("del bin dist *.tgz README.md CHANGELOG.md", true),
    () => execute("webpack --mode=production", true),
    () => execute("cpy README.md CHANGELOG.md ../.. --cwd=.github", true),
    () =>
      !includeNode
        ? execute("del dist/node.js", true).then(omitNodeFromPackageJSON)
        : Promise.resolve(),
  );
}

async function omitNodeFromPackageJSON(): Promise<void> {
  const packageJSON = await getPackageJSON();
  if (!packageJSON.exports?.node) return;

  await execute(
    "cpy package.json node_modules --rename=.packagejsoncache",
    true,
  );
  delete packageJSON.exports.node;

  await files.upsertFile(
    "package.json",
    JSON.stringify(packageJSON, undefined, 2),
    true,
  );
}

prepack();
