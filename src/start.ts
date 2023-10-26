import run from "./_run";
import { start as start_core } from "./core";
import { start as start_eslint } from "./eslint";
import { start as start_github } from "./github";
import { start as start_prettier } from "./prettier";
import { start as start_typescript } from "./typescript";
import { start as start_webpack } from "./webpack";

export default async function start(): Promise<void> {
  await run({
    core: start_core,
    eslint: start_eslint,
    github: start_github,
    prettier: start_prettier,
    typescript: start_typescript,
    webpack: start_webpack,
  });
}

start();
