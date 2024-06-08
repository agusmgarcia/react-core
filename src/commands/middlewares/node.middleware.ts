import { type Func } from "../../utilities";
import { isLibrary, upsertFile } from "../utilities";

export default async function nodeMiddleware(
  next: Func<[Promise<void>]>,
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
package-lock.json
tsconfig.json
webpack.config.js`;
