import { sortProperties } from "../utils";
import createMiddleware, { type Context } from "./createMiddleware";

export default createMiddleware<Record<string, any>>({
  mapOutput: (output) => sortProperties(output),
  path: "tsconfig.json",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

function getTemplate(context: Context): Record<string, any> {
  return context.core === "app"
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
        exclude: ["dist", "node_modules"],
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
      }
    : context.core === "azure-func"
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
            noEmit: false,
            noImplicitOverride: true,
            outDir: "./dist",
            paths: {
              "#src/*": ["src/*"],
            },
            plugins: [{ name: "next" }],
            resolveJsonModule: true,
            rootDir: "./src",
            skipLibCheck: true,
            strict: true,
            target: "ES2017",
            tsBuildInfoFile: "node_modules/.typescriptcache",
          },
          exclude: ["dist", "node_modules"],
          include: ["**/*.ts"],
        }
      : context.core === "lib"
        ? {
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
              module: "esnext",
              moduleResolution: "bundler",
              noEmit: false,
              noImplicitOverride: true,
              outDir: "./dist",
              paths: {
                "#src/*": ["src/*"],
              },
              plugins: [{ name: "next" }],
              resolveJsonModule: true,
              rootDir: "./src",
              skipLibCheck: true,
              strict: true,
              target: "ES2017",
              tsBuildInfoFile: "node_modules/.typescriptcache",
            },
            exclude: ["bin", "dist", "node_modules"],
            include: ["**/*.ts", "**/*.tsx"],
          }
        : {
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
              noEmit: false,
              noImplicitOverride: true,
              outDir: "./dist",
              paths: {
                "#src/*": ["src/*"],
              },
              plugins: [{ name: "next" }],
              resolveJsonModule: true,
              rootDir: "./src",
              skipLibCheck: true,
              strict: true,
              target: "ES2017",
              tsBuildInfoFile: "node_modules/.typescriptcache",
            },
            exclude: ["dist", "node_modules"],
            include: ["**/*.ts"],
          };
}
