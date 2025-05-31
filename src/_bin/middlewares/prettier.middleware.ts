import { type AsyncFunc } from "#src/utils";

import { files } from "../utils";

export default async function prettierMiddleware(
  _: string,
  next: AsyncFunc,
  regenerate: "hard" | "soft" | undefined,
  ignore: string[],
): Promise<void> {
  await Promise.all([
    files.removeFile(".prettierrc", true),
    files.removeFile(".prettierignore", true),
    files.upsertFile(
      "prettier.config.js",
      prettierConfig,
      !!regenerate && !ignore.includes("prettier.config.js"),
    ),
  ]);

  await next();
}

const prettierConfig = `/** @type import("prettier").RequiredOptions */
module.exports = {
  plugins: ["prettier-plugin-tailwindcss"],
};
`;
