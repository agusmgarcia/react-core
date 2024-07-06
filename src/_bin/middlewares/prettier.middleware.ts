import { type AsyncFunc } from "#src/utilities";

import { execute, isLibrary, upsertFile } from "../utilities";

export default async function prettierMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const library = await isLibrary();

  try {
    const configFilePath = await execute("prettier --find-config-path .", false)
      .then((cfg) => cfg.replace("\n", ""))
      .then((cfg) => cfg.replace("\r", ""));

    if (configFilePath !== ".prettierrc")
      console.warn(
        `[warn] Prettier configure file "${configFilePath}" will be ignored in favor of ".prettierrc"`,
      );
  } catch (error: any) {
    if (
      error.message.replace("\n", "").replace("\r", "") !==
      '[error] Can not find configure file for ".".'
    )
      throw error;
  }

  await Promise.all([
    upsertFile(
      ".prettierrc",
      prettierrc,
      regenerate && !ignore.includes(".prettierrc"),
    ),
    upsertFile(
      ".prettierignore",
      !library ? prettierignore_app : prettierIgnore_lib,
      regenerate && !ignore.includes(".prettierignore"),
    ),
  ]);

  await next();
}

const prettierrc = `{
  "overrides": [{ "files": [".eslintrc"], "options": { "parser": "json" } }],
  "plugins": ["prettier-plugin-tailwindcss"]
}
`;

const prettierignore_app = `.env.local
.next
node_modules
out`;

const prettierIgnore_lib = `bin
dist
node_modules
*.tgz`;
