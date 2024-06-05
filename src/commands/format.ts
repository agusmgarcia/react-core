import run from "./_run";
import { format as format_core } from "./core";
import { format as format_eslint } from "./eslint";
import { format as format_github } from "./github";
import { format as format_prettier } from "./prettier";
import { format as format_typescript } from "./typescript";
import { format as format_webpack } from "./webpack";

export default async function format(): Promise<void> {
  await run({
    core: format_core,
    eslint: format_eslint,
    github: format_github,
    prettier: format_prettier,
    typescript: format_typescript,
    webpack: format_webpack,
  });
}

format();
