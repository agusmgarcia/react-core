import { execute, isLibrary, writeFile } from "../_utils";

export default async function withContext<TResult>(
  callback: () => TResult | Promise<TResult>,
  options: { skip: string[] },
): Promise<TResult> {
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
    writeFile(".prettierrc", prettierrc, options.skip.includes(".prettierrc")),
    writeFile(
      ".prettierignore",
      !library ? prettierignore_app : prettierIgnore_lib,
      options.skip.includes(".prettierignore"),
    ),
  ]);

  return await callback();
}

const prettierrc = `{}
`;

const prettierignore_app = `.env.local
.next
node_modules
out`;

const prettierIgnore_lib = `bin
dist
node_modules
*.tgz`;
