import { type AsyncFunc } from "#src/utils";

import {
  createObjectWithPropertiesSorted,
  execute,
  files,
  getCore,
  getPackageJSON,
  git,
} from "../utils";

export default async function packageJSONMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  await files.upsertFile(
    "package.json",
    await createPackageFile(),
    regenerate && !ignore.includes("package.json"),
  );

  const core = await getCore();

  if (core === "azure-func") {
    if (regenerate && !ignore.includes("package.json")) {
      await execute("npm i @azure/functions@4", false);
      // TODO: remove this line when azure-functions-core-tools were lighther
      await execute("npm i azure-functions-core-tools@4 --save-dev", false);
    }
  } else {
    await execute("npm uninstall @azure/functions", false);
    // TODO: remove this line when azure-functions-core-tools were lighther
    await execute("npm uninstall azure-functions-core-tools", false);
  }

  await execute("npm i", false);

  await next();
}

async function createPackageFile(): Promise<string> {
  let packageJSON = await getPackageJSON();

  const repositoryDetails = await git.getRepositoryDetails();

  if (!packageJSON.name && !!repositoryDetails)
    packageJSON.name = `@${repositoryDetails.owner}/${repositoryDetails.name}`;

  if (
    packageJSON.core !== "app" &&
    packageJSON.core !== "azure-func" &&
    packageJSON.core !== "lib"
  )
    packageJSON.core =
      typeof packageJSON.private === "string"
        ? packageJSON.private === "true"
          ? "app"
          : "lib"
        : !!packageJSON.private
          ? "app"
          : "lib";

  const version = await git
    .getTags({ merged: true })
    .then((tags) => tags.at(-1))
    .then((tag) => git.getTagInfo(tag || "v0.0.0"))
    .then((info) => `${info.major}.${info.minor}.${info.patch}`);

  packageJSON.version = version;

  packageJSON.private =
    packageJSON.core === "app" || packageJSON.core === "azure-func";

  if (packageJSON.core === "app" && !!packageJSON.main) delete packageJSON.main;

  if (packageJSON.core === "azure-func" && !packageJSON.main)
    packageJSON.main = "dist/{index.js,functions/*.js}";

  if (packageJSON.core === "lib" && !packageJSON.main)
    packageJSON.main = "dist/index.js";

  if (
    (packageJSON.core === "app" || packageJSON.core === "azure-func") &&
    !!packageJSON.types
  )
    delete packageJSON.types;

  if (packageJSON.core === "lib" && !packageJSON.types)
    packageJSON.types = "dist/index.d.ts";

  if (!packageJSON.author) packageJSON.author = repositoryDetails?.owner || "";

  if (!packageJSON.description) packageJSON.description = "";

  if (!packageJSON.scripts) packageJSON.scripts = {};

  const commands = [
    "build",
    "check",
    "deploy",
    "format",
    "postpack",
    "prepack",
    "regenerate",
    "start",
    "test",
  ];

  for (const command of commands)
    if (!packageJSON.scripts[command])
      packageJSON.scripts[command] = `agusmgarcia-react-core-${command}`;

  const remoteURL = await git.getRemoteURL();

  if (
    (packageJSON.core === "app" || packageJSON.core === "azure-func") &&
    !!packageJSON.repository
  )
    delete packageJSON.repository;

  if (packageJSON.core === "lib" && !packageJSON.repository && !!remoteURL)
    packageJSON.repository = {
      type: "git",
      url: `git+${remoteURL}.git`,
    };

  const newPackageJSON = createObjectWithPropertiesSorted(packageJSON, [
    "name",
    "core",
    "version",
    "private",
    "main",
    "types",
    "author",
    "description",
    "bin",
    "scripts",
    "dependencies",
    "peerDependencies",
    "devDependencies",
    "optionalDependencies",
    "engines",
    "repository",
  ]);

  return JSON.stringify(newPackageJSON, undefined, 2);
}
