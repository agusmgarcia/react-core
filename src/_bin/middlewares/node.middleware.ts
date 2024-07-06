import { type AsyncFunc } from "#src/utilities";

import { isLibrary, upsertFile } from "../utilities";

export default async function nodeMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  await Promise.all([
    upsertFile(".nvmrc", nvmrc, regenerate && !ignore.includes(".nvmrc")),
    isLibrary().then((library) =>
      library
        ? upsertFile(
            ".npmignore",
            npmignore,
            regenerate && !ignore.includes(".npmignore"),
          )
        : Promise.resolve(),
    ),
  ]);
  await next();
}

const nvmrc = "20";

const npmignore = `**/.*
src
jest.config.js
package-lock.json
tsconfig.json
webpack.config.js`;
