import path from "path";
import semver from "semver";

import { type AsyncFunc, merges } from "#src/utils";

import {
  files,
  getCore,
  getPackageJSON,
  git,
  npm,
  sortProperties,
} from "../utils";

export default async function packageJSONMiddleware(
  _: string,
  next: AsyncFunc,
  regenerate: "hard" | "soft" | undefined,
  ignore: string[],
): Promise<void> {
  const core = await getCore();

  if (!!regenerate && !ignore.includes("package.json")) {
    if (core === "azure-func") {
      await npm.install("@azure/functions@4");
      // TODO: remove this line when azure-functions-core-tools were lighther
      await npm.install("azure-functions-core-tools@4", { dev: true });
    } else {
      await npm.uninstall("@azure/functions");
      // TODO: remove this line when azure-functions-core-tools were lighther
      await npm.uninstall("azure-functions-core-tools");
    }

    await files.upsertFile(
      "package.json",
      await createPackageJSONFile(core, regenerate),
      true,
    );

    await npm.install();
  }

  await next();
}

async function createPackageJSONFile(
  core: Awaited<ReturnType<typeof getCore>>,
  regenerate: "hard" | "soft" | undefined,
): Promise<string> {
  if (!regenerate) return "";

  const [packageJSON, insideRepository] = await Promise.all([
    getPackageJSON(),
    git.isInsideRepository(),
  ]);

  const [repositoryDetails, version, remoteURL, reactCore] = insideRepository
    ? await Promise.all([
        git.getRepositoryDetails(),
        git
          .getTags({ merged: true })
          .then((tags) => tags.at(-1))
          .then((tag) => git.getTagInfo(tag || "v0.0.0"))
          .then((info) => `${info.major}.${info.minor}.${info.patch}`),
        git.getRemoteURL(),
        git.isReactCore(),
      ])
    : [undefined, "0.0.0", undefined, false];

  const template = {
    author: packageJSON.author || repositoryDetails?.owner || "",
    description: packageJSON.description || "",
    name:
      packageJSON.name ||
      (!!repositoryDetails
        ? `@${repositoryDetails.owner}/${repositoryDetails.name}`
        : path.basename(process.cwd())),
    repository:
      !!remoteURL && core === "lib"
        ? {
            type: "git",
            url: `git+${remoteURL}.git`,
          }
        : undefined,
    scripts: !reactCore
      ? {
          build: "agusmgarcia-react-core-build",
          check: "agusmgarcia-react-core-check",
          deploy: "agusmgarcia-react-core-deploy",
          format: "agusmgarcia-react-core-format",
          postpack: "agusmgarcia-react-core-postpack",
          prepack: "agusmgarcia-react-core-prepack",
          start: "agusmgarcia-react-core-start",
          test: "agusmgarcia-react-core-test",
        }
      : {
          build: "tsx src/_bin/build.ts",
          check: "tsx src/_bin/check.ts",
          deploy: "tsx src/_bin/deploy.ts",
          format: "tsx src/_bin/format.ts",
          postpack: "tsx src/_bin/postpack.ts",
          prepack: "tsx src/_bin/prepack.ts",
          start: "tsx src/_bin/start.ts",
          test: "tsx src/_bin/test.ts",
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
        : core === "lib"
          ? {
              core,
              engines,
              exports: {
                default: "./dist/index.js",
                node: "./dist/node.js",
                types: "./dist/index.d.ts",
              },
              main: undefined,
              private: false,
              types: undefined,
              version,
            }
          : {
              core,
              engines,
              main: undefined,
              private: true,
              repository: undefined,
              types: undefined,
              version,
            };

  return JSON.stringify(
    sortProperties(
      merges.deep(
        merges.deep(
          regenerate === "soft" ? template : packageJSON,
          regenerate === "soft" ? packageJSON : template,
          { sort: true },
        ),
        source,
        { sort: true },
      ),
      [
        "name",
        "core",
        "version",
        "private",
        "main",
        "types",
        "exports",
        "exports.types",
        "exports.node",
        "exports.default",
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
