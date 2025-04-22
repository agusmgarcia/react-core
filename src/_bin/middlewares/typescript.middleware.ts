import { type AsyncFunc, merges } from "#src/utils";

import { files, getCore } from "../utils";

export default async function typescriptMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const core = await getCore();

  await files.upsertFile(
    "tsconfig.json",
    await createTsconfigFile(core),
    regenerate && !ignore.includes("tsconfig.json"),
  );

  await next();
}

async function createTsconfigFile(
  core: Awaited<ReturnType<typeof getCore>>,
): Promise<string> {
  const tsconfig = await files
    .readFile("tsconfig.json")
    .then((result) => (!!result ? JSON.parse(result) : {}));

  const source =
    core === "app"
      ? {
          compilerOptions: {
            allowJs: true,
            baseUrl: "./",
            declaration: false,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
            incremental: true,
            isolatedModules: true,
            jsx: "preserve",
            lib: ["DOM", "DOM.Iterable", "ESNext"],
            module: "esnext",
            moduleResolution: "bundler",
            noEmit: true,
            noImplicitOverride: true,
            paths: {
              "#public/*": ["public/*"],
              "#src/*": ["src/*"],
            },
            plugins: [{ name: "next" }],
            resolveJsonModule: true,
            skipLibCheck: true,
            strict: true,
            target: "ES2017",
            tsBuildInfoFile: "node_modules/.typescriptcache",
          },
          exclude: [".next", "node_modules", "out"],
          include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
        }
      : core === "azure-func"
        ? {
            compilerOptions: {
              allowJs: true,
              baseUrl: "./",
              declaration: false,
              esModuleInterop: true,
              forceConsistentCasingInFileNames: true,
              incremental: true,
              isolatedModules: true,
              jsx: "preserve",
              lib: ["DOM", "DOM.Iterable", "ESNext"],
              module: "commonjs",
              moduleResolution: "node",
              noEmit: false,
              noImplicitOverride: true,
              outDir: "./dist",
              paths: {
                "#src/*": ["src/*"],
              },
              resolveJsonModule: true,
              rootDir: "./src",
              skipLibCheck: true,
              strict: true,
              target: "es5",
              tsBuildInfoFile: "node_modules/.typescriptcache",
            },
            exclude: ["dist", "node_modules"],
            include: ["**/*.ts"],
          }
        : {
            compilerOptions: {
              allowJs: true,
              baseUrl: "./",
              declaration: true,
              esModuleInterop: true,
              forceConsistentCasingInFileNames: true,
              incremental: true,
              isolatedModules: true,
              jsx: "preserve",
              lib: ["DOM", "DOM.Iterable", "ESNext"],
              module: "commonjs",
              moduleResolution: "node",
              noEmit: false,
              noImplicitOverride: true,
              outDir: "./dist",
              paths: {
                "#src/*": ["src/*"],
              },
              resolveJsonModule: true,
              rootDir: "./src",
              skipLibCheck: true,
              strict: true,
              target: "es5",
              tsBuildInfoFile: "node_modules/.typescriptcache",
            },
            exclude: ["bin", "dist", "node_modules"],
            include: ["**/*.ts", "**/*.tsx"],
          };

  return JSON.stringify(
    merges.deep(tsconfig, source, {
      arrayConcat: true,
      arrayRemoveDuplicated: true,
      sort: true,
    }),
    undefined,
    2,
  );
}
