import { type AsyncFunc, merges } from "#src/utils";

import { files, isLibrary } from "../utils";

export default async function typescriptMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const library = await isLibrary();
  await files.upsertFile(
    "tsconfig.json",
    await createTsconfigFile(library),
    regenerate && !ignore.includes("tsconfig.json"),
  );
  await next();
}

async function createTsconfigFile(library: boolean): Promise<string> {
  const tsconfig = await files
    .readFile("tsconfig.json")
    .then((result) => (!!result ? JSON.parse(result) : {}));

  const source = !library
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
        exclude: [".next", "node_modules"],
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
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
        exclude: ["node_modules"],
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
