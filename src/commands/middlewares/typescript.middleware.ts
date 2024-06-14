import { type Func } from "../../utilities";
import { isLibrary, upsertFile } from "../utilities";

export default async function typescriptMiddleware(
  next: Func<Promise<void>>,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const library = await isLibrary();
  await upsertFile(
    "tsconfig.json",
    !library ? tsconfig_app : tsconfig_lib,
    regenerate && !ignore.includes("tsconfig.json"),
  );
  await next();
}

const tsconfig_app = `{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "./",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "esnext",
    "moduleResolution": "node",
    "noEmit": true,
    "noImplicitOverride": true,
    "paths": {
      "#public/*": ["public/*"],
      "#src/*": ["src/*"]
    },
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "es5",
    "tsBuildInfoFile": "node_modules/.typescriptcache"
  },
  "exclude": [".env.local", ".next", "node_modules", "out"],
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}
`;

const tsconfig_lib = `{
  "compilerOptions": {
    "allowJs": true,
    "declaration": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "lib": ["DOM"],
    "module": "commonjs",
    "moduleResolution": "node",
    "noEmit": false,
    "noImplicitOverride": true,
    "outDir": "./dist",
    "resolveJsonModule": true,
    "rootDir": "./src",
    "skipLibCheck": true,
    "strict": true,
    "target": "es5",
    "tsBuildInfoFile": "node_modules/.typescriptcache"
  },
  "exclude": ["bin", "dist", "node_modules", "*.tgz"],
  "include": ["**/*.ts", "**/*.tsx"]
}
`;
