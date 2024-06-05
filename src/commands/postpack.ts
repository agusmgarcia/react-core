import run from "./_run";
import { postpack as postpack_core } from "./core";
import { postpack as postpack_eslint } from "./eslint";
import { postpack as postpack_github } from "./github";
import { postpack as postpack_prettier } from "./prettier";
import { postpack as postpack_typescript } from "./typescript";
import { postpack as postpack_webpack } from "./webpack";

export default async function postpack(): Promise<void> {
  await run({
    core: postpack_core,
    eslint: postpack_eslint,
    github: postpack_github,
    prettier: postpack_prettier,
    typescript: postpack_typescript,
    webpack: postpack_webpack,
  });
}

postpack();
