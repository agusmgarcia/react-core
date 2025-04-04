import { type AsyncFunc } from "#src/utils";

import { files, getCore } from "../utils";

export default async function typescriptMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const core = await getCore();

  await files.upsertFile(
    "tsconfig.json",
    core === "app"
      ? tsconfig_app
      : core === "azure-func"
        ? tsconfig_azure_func
        : tsconfig_lib,
    regenerate && !ignore.includes("tsconfig.json"),
  );

  await next();
}

const tsconfig_app = `{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "./",
    "declaration": false,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "noImplicitOverride": true,
    "paths": {
      "#public/*": ["public/*"],
      "#src/*": ["src/*"]
    },
    "plugins": [{ "name": "next" }],
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2017",
    "tsBuildInfoFile": "node_modules/.typescriptcache"
  },
  "exclude": [".next", "node_modules"],
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}
`;

const tsconfig_azure_func = `{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "./",
    "declaration": false,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "commonjs",
    "moduleResolution": "node",
    "noEmit": false,
    "noImplicitOverride": true,
    "paths": {
      "#src/*": ["src/*"]
    },
    "outDir": "./dist",
    "resolveJsonModule": true,
    "rootDir": "./src",
    "skipLibCheck": true,
    "strict": true,
    "target": "es5",
    "tsBuildInfoFile": "node_modules/.typescriptcache"
  },
  "exclude": ["node_modules"],
  "include": ["**/*.ts"]
}
`;

const tsconfig_lib = `{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "./",
    "declaration": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "commonjs",
    "moduleResolution": "node",
    "noEmit": false,
    "noImplicitOverride": true,
    "paths": {
      "#src/*": ["src/*"]
    },
    "outDir": "./dist",
    "resolveJsonModule": true,
    "rootDir": "./src",
    "skipLibCheck": true,
    "strict": true,
    "target": "es5",
    "tsBuildInfoFile": "node_modules/.typescriptcache"
  },
  "exclude": ["node_modules"],
  "include": ["**/*.ts", "**/*.tsx"]
}
`;
