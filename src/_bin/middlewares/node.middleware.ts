import { EOL } from "os";

import { type AsyncFunc, merges } from "#src/utils";

import { files, getCore } from "../utils";

export default async function nodeMiddleware(
  _: string,
  next: AsyncFunc,
  regenerate: "hard" | "soft" | undefined,
  ignore: string[],
): Promise<void> {
  await Promise.all([
    files.upsertFile(
      ".nvmrc",
      nvmrc,
      !!regenerate && !ignore.includes(".nvmrc"),
    ),
    getCore().then(async (core) =>
      core === "lib"
        ? files.upsertFile(
            ".npmignore",
            await createNpmignoreFile(regenerate),
            !!regenerate && !ignore.includes(".npmignore"),
          )
        : files.removeFile(".npmignore"),
    ),
  ]);

  await next();
}

const nvmrc = "22.14";

async function createNpmignoreFile(
  regenerate: "hard" | "soft" | undefined,
): Promise<string> {
  if (!regenerate) return "";

  const npmignore =
    regenerate === "soft"
      ? await files
          .readFile(".npmignore")
          .then((result) => (!!result ? result.split(EOL) : []))
      : [];

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
