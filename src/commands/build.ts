import run from "./_run";
import { build as build_core } from "./core";
import { build as build_eslint } from "./eslint";
import { build as build_github } from "./github";
import { build as build_prettier } from "./prettier";
import { build as build_typescript } from "./typescript";
import { build as build_webpack } from "./webpack";

export default async function build(): Promise<void> {
  await run({
    core: build_core,
    eslint: build_eslint,
    github: build_github,
    prettier: build_prettier,
    typescript: build_typescript,
    webpack: build_webpack,
  });
}

build();
