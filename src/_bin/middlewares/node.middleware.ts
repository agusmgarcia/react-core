import { EOL } from "os";

import { type AsyncFunc, merges } from "#src/utils";

import { files, isLibrary } from "../utils";

export default async function nodeMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  await Promise.all([
    files.upsertFile(".nvmrc", nvmrc, regenerate && !ignore.includes(".nvmrc")),
    isLibrary().then(async (library) =>
      library
        ? files.upsertFile(
            ".npmignore",
            await createNpmignoreFile(),
            regenerate && !ignore.includes(".npmignore"),
          )
        : Promise.resolve(),
    ),
  ]);
  await next();
}

const nvmrc = "22.14";

async function createNpmignoreFile(): Promise<string> {
  const npmignore = await files
    .readFile(".npmignore")
    .then((result) => (!!result ? result.split(EOL) : []));

  const source = [
    "**/.*",
    "dist/**/*.test.d.ts",
    "eslint.config.js",
    "jest.config.js",
    "package-lock.json",
    "postcss.config.js",
    "prettier.config.js",
    "src",
    "tailwind.config.js",
    "tsconfig.json",
    "webpack.config.js",
  ];

  return merges
    .deep(npmignore, source, {
      arrayConcat: true,
      arrayRemoveDuplicated: true,
      sort: true,
    })
    .join(EOL);
}
