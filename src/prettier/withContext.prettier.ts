import { execute, writeFile } from "../_utils";

export default async function withContext<TResult>(
  callback: () => TResult | Promise<TResult>,
): Promise<TResult> {
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
    writeFile(".prettierrc", prettierrc),
    writeFile(".prettierignore", prettierignore),
  ]);

  return await callback();
}

const prettierrc = `{}
`;

const prettierignore = `.next
bin
dist
node_modules
out
*.tgz`;
