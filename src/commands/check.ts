import run from "./_run";
import { check as check_core } from "./core";
import { check as check_eslint } from "./eslint";
import { check as check_github } from "./github";
import { check as check_prettier } from "./prettier";
import { check as check_typescript } from "./typescript";
import { check as check_webpack } from "./webpack";

export default async function check(): Promise<void> {
  await run({
    core: check_core,
    eslint: check_eslint,
    github: check_github,
    prettier: check_prettier,
    typescript: check_typescript,
    webpack: check_webpack,
  });
}

check();
