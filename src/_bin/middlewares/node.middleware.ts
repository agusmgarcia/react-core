import { type AsyncFunc } from "#src/utils";

import { files, isLibrary } from "../utils";

export default async function nodeMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  await Promise.all([
    files.upsertFile(".nvmrc", nvmrc, regenerate && !ignore.includes(".nvmrc")),
    isLibrary().then((library) =>
      library
        ? files.upsertFile(
            ".npmignore",
            npmignore,
            regenerate && !ignore.includes(".npmignore"),
          )
        : Promise.resolve(),
    ),
  ]);
  await next();
}

const nvmrc = "22.14";

const npmignore = `**/.*
dist/**/*.test.d.ts
src
eslint.config.js
jest.config.js
package-lock.json
postcss.config.js
prettier.config.js
tailwind.config.js
tsconfig.json
webpack.config.js`;
