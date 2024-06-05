import run from "./_run";
import { prepack as prepack_core } from "./core";
import { prepack as prepack_eslint } from "./eslint";
import { prepack as prepack_github } from "./github";
import { prepack as prepack_prettier } from "./prettier";
import { prepack as prepack_typescript } from "./typescript";
import { prepack as prepack_webpack } from "./webpack";

export default async function prepack(): Promise<void> {
  await run({
    core: prepack_core,
    eslint: prepack_eslint,
    github: prepack_github,
    prettier: prepack_prettier,
    typescript: prepack_typescript,
    webpack: prepack_webpack,
  });
}

prepack();
