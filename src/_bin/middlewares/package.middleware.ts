import path from "path";

import { execute, getPackageJSON, git, npm, sortProperties } from "../utils";
import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<Record<string, any>>({
  mapOutput: (output) =>
    sortProperties(output, [
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
    ]),
  path: "package.json",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function packageMiddleware(
  context: Context,
): Promise<void> {
  await MIDDLEWARE(context);
  await execute("npm i", false);
}

async function getTemplate(context: Context): Promise<Record<string, any>> {
  const [repositoryDetails, remoteURL, reactCore] =
    (await git.isInsideRepository())
      ? await Promise.all([
          git.getRepositoryDetails(),
          git.getRemoteURL(),
          git.isReactCore(),
        ])
      : [undefined, undefined, false];

  const packageJSON = await getPackageJSON();

  const [
    reactCoreVersion,
    functionsVersion,
    azureFunctionsCoreToolsVersion,
    nextVersion,
    reactVersion,
    reactDomVersion,
  ] = await Promise.all([
    packageJSON.dependencies?.["@agusmgarcia/react-core"] ||
      packageJSON.peerDependencies?.["@agusmgarcia/react-core"] ||
      packageJSON.devDependencies?.["@agusmgarcia/react-core"],
    npm.getVersion("@azure/functions@4").then((v) => `^${v}`),
    npm.getVersion("azure-functions-core-tools@4").then((v) => `^${v}`),
    npm.getVersion("next@15").then((v) => `^${v}`),
    npm.getVersion("react@19").then((v) => `^${v}`),
    npm.getVersion("react-dom@19").then((v) => `^${v}`),
  ]);

  return {
    author: repositoryDetails?.owner || "",
    core: context.core,
    description: "",
    engines: {
      node: "22.14.0",
    },
    name: !!repositoryDetails
      ? `@${repositoryDetails.owner}/${repositoryDetails.name}`
      : path.basename(process.cwd()),
    optionalDependencies: undefined,
    scripts: !reactCore
      ? {
          build: "agusmgarcia-react-core-build",
          check: "agusmgarcia-react-core-check",
          deploy: "agusmgarcia-react-core-deploy",
          format: "agusmgarcia-react-core-format",
          postpack: "agusmgarcia-react-core-postpack",
          prepack: "agusmgarcia-react-core-prepack",
          regenerate: "agusmgarcia-react-core-regenerate",
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
          regenerate: "tsx src/_bin/regenerate.ts",
          start: "tsx src/_bin/start.ts",
          test: "tsx src/_bin/test.ts",
        },
    version: context.version,

    ...(context.core === "app"
      ? {
          dependencies: {
            next: nextVersion,
            react: reactVersion,
            "react-dom": reactDomVersion,
          },
          devDependencies:
            !!reactCoreVersion && !reactCore
              ? { "@agusmgarcia/react-core": reactCoreVersion }
              : undefined,
          main: undefined,
          peerDependencies: undefined,
          private: true,
          repository: undefined,
          types: undefined,
        }
      : context.core === "azure-func"
        ? {
            dependencies: {
              "@azure/functions": functionsVersion,
            },
            devDependencies: {
              "@agusmgarcia/react-core":
                !!reactCoreVersion && !reactCore ? reactCoreVersion : undefined,
              "azure-functions-core-tools": azureFunctionsCoreToolsVersion,
            },
            main: "dist/{index.js,functions/*.js}",
            peerDependencies: undefined,
            private: true,
            repository: undefined,
            types: undefined,
          }
        : context.core === "lib"
          ? {
              dependencies: undefined,
              devDependencies: !!reactCore
                ? packageJSON.devDependencies
                : !!reactCoreVersion
                  ? { "@agusmgarcia/react-core": reactCoreVersion }
                  : undefined,
              exports: {
                default: "./dist/index.js",
                node: "./dist/node.js",
                types: "./dist/index.d.ts",
              },
              main: undefined,
              peerDependencies: !!reactCore
                ? packageJSON.peerDependencies
                : { react: reactVersion, "react-dom": reactDomVersion },
              private: false,
              repository: !!remoteURL
                ? {
                    type: "git",
                    url: `git+${remoteURL}.git`,
                  }
                : undefined,
              types: undefined,
            }
          : {
              dependencies: undefined,
              devDependencies:
                !!reactCoreVersion && !reactCore
                  ? { "@agusmgarcia/react-core": reactCoreVersion }
                  : undefined,
              main: undefined,
              peerDependencies: undefined,
              private: true,
              repository: undefined,
              types: undefined,
            }),
  };
}
