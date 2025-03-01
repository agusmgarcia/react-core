import { type AsyncFunc } from "#src/utils";

import { files, isLibrary } from "../utils";

export default async function prettierMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const library = await isLibrary();

  await Promise.all([
    files.upsertFile(
      ".prettierrc",
      prettierrc,
      regenerate && !ignore.includes(".prettierrc"),
    ),
    files.upsertFile(
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
