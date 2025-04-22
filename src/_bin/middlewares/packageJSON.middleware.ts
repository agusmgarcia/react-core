import semver from "semver";

import { type AsyncFunc, merges } from "#src/utils";

import {
  execute,
  files,
  getCore,
  getPackageJSON,
  git,
  sortProperties,
} from "../utils";

export default async function packageJSONMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
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

  const engines = {
    node:
      !!packageJSON.engines?.node &&
      semver.satisfies("22.14.0", packageJSON.engines.node)
        ? packageJSON.engines.node
        : "22.14.0",
  };

  const source =
    core === "app"
      ? {
          core,
          engines,
          main: undefined,
          private: true,
          repository: undefined,
          types: undefined,
          version,
        }
      : core === "azure-func"
        ? {
            core,
            engines,
            main: "dist/{index.js,functions/*.js}",
            private: true,
            repository: undefined,
            types: undefined,
            version,
          }
        : {
            core,
            engines,
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
