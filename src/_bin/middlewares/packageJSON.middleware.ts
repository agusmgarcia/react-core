import { type AsyncFunc } from "#src/utils";

import { execute, files, getPackageJSON, git } from "../utils";

export default async function packageJSONMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const packageJSON = await getPackageJSON();

  await files.upsertFile(
    "package.json",
    await addMissingAttributes(packageJSON),
    regenerate && !ignore.includes("package.json"),
  );

  await execute("npm i", false);

  await next();
}

async function addMissingAttributes(
  packageJSON: Awaited<ReturnType<typeof getPackageJSON>>,
): Promise<string> {
  const repositoryDetails = await git.getRepositoryDetails();

  if (!packageJSON.name && !!repositoryDetails)
    packageJSON.name = `@${repositoryDetails.owner}/${repositoryDetails.name}`;

  const version = await git
    .getTags({ merged: true })
    .then((tags) => tags.at(-1))
    .then((tag) => git.getTagInfo(tag || "v0.0.0"))
    .then((info) => `${info.major}.${info.minor}.${info.patch}`);

  packageJSON.version = version;

  if (typeof packageJSON.private === "string")
    packageJSON.private = packageJSON.private === "true";

  if (!packageJSON.private) packageJSON.private = false;

  if (!packageJSON.private && !packageJSON.main)
    packageJSON.main = "dist/index.js";

  if (!!packageJSON.private && !!packageJSON.main) delete packageJSON.main;

  if (!packageJSON.private && !packageJSON.types)
    packageJSON.types = "dist/index.d.ts";

  if (!!packageJSON.private && !!packageJSON.types) delete packageJSON.types;

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

  if (!packageJSON.private && !packageJSON.repository && !!remoteURL)
    packageJSON.repository = {
      type: "git",
      url: `git+${remoteURL}.git`,
    };

  if (!!packageJSON.private && !!packageJSON.repository)
    delete packageJSON.repository;

  const newPackageJSON = createObjectWithPropertiesSorted(packageJSON, [
    "name",
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

function createObjectWithPropertiesSorted<TElement extends object>(
  input: TElement,
  preferred: (keyof TElement)[] = [],
): TElement {
  const sortKeys = (key1: string, key2: string): number => {
    const indexOfKey1 = preferred.indexOf(key1 as keyof TElement);
    const indexOfKey2 = preferred.indexOf(key2 as keyof TElement);

    if (indexOfKey1 === -1 && indexOfKey2 === -1)
      return +(key1 > key2) || -(key2 > key1);

    if (indexOfKey1 === -1) return 1;
    if (indexOfKey2 === -1) return -1;

    return indexOfKey1 - indexOfKey2;
  };

  return Object.keys(input)
    .sort(sortKeys)
    .reduce((result, key) => {
      const property = input[key as keyof TElement];
      result[key as keyof TElement] =
        typeof property !== "object" || !property
          ? property
          : createObjectWithPropertiesSorted(property);
      return result;
    }, {} as TElement);
}
