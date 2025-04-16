import { type AsyncFunc, merges } from "#src/utils";

import { execute, files, getCore, getPackageJSON, git } from "../utils";

export default async function packageJSONMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const core = await getCore();

  await files.upsertFile(
    "package.json",
    await createPackageJSONFile(core),
    regenerate && !ignore.includes("package.json"),
  );

  await execute("npm i", false);

  await next();
}

async function createPackageJSONFile(
  core: Awaited<ReturnType<typeof getCore>>,
): Promise<string> {
  const [packageJSON, insideRepository] = await Promise.all([
    getPackageJSON(),
    git.isInsideRepository(),
  ]);

  const [repositoryDetails, version, remoteURL] = insideRepository
    ? await Promise.all([
        git.getRepositoryDetails(),
        git
          .getTags({ merged: true })
          .then((tags) => tags.at(-1))
          .then((tag) => git.getTagInfo(tag || "v0.0.0"))
          .then((info) => `${info.major}.${info.minor}.${info.patch}`),
        git.getRemoteURL(),
      ])
    : [undefined, "0.0.0", undefined];

  const template = {
    author: !!repositoryDetails?.owner || "",
    description: "",
    name: !!repositoryDetails
      ? `@${repositoryDetails.owner}/${repositoryDetails.name}`
      : "",
    repository:
      !!remoteURL && core === "lib"
        ? {
            type: "git",
            url: `git+${remoteURL}.git`,
          }
        : undefined,
    scripts: {
      build: "agusmgarcia-react-core-build",
      check: "agusmgarcia-react-core-check",
      deploy: "agusmgarcia-react-core-deploy",
      format: "agusmgarcia-react-core-format",
      postpack: "agusmgarcia-react-core-postpack",
      prepack: "agusmgarcia-react-core-prepack",
      regenerate: "agusmgarcia-react-core-regenerate",
      start: "agusmgarcia-react-core-start",
      test: "agusmgarcia-react-core-test",
    },
  };

  const source =
    core === "app"
      ? {
          core,
          main: undefined,
          private: true,
          repository: undefined,
          types: undefined,
          version,
        }
      : {
          core,
          main: "dist/index.js",
          private: false,
          types: "dist/index.d.ts",
          version,
        };

  return JSON.stringify(
    sortProperties(
      merges.deep(
        merges.deep(template, packageJSON, {
          arrayConcat: true,
          arrayRemoveDuplicated: true,
          sort: true,
        }),
        source,
        {
          arrayConcat: true,
          arrayRemoveDuplicated: true,
          sort: true,
        },
      ),
      [
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
      ],
    ),
    undefined,
    2,
  );
}

function sortProperties<TElement extends Record<string, any>>(
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
      (result as any)[key] = input[key];
      return result;
    }, {} as TElement);
}
