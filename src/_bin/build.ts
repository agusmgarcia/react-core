import run from "./_run";
import { execute, getCore } from "./utils";

export default async function build(): Promise<void> {
  const core = await getCore();

  if (core === "app")
    await run(
      "build",
      false,
      () => execute("del .next out", true),
      () => execute("next build --no-lint", true),
    );

  if (core === "azure-func")
    await run(
      "build",
      false,
      () => execute("del dist", true),
      () => execute("webpack --mode=production", true),
    );

  if (core === "lib")
    await run(
      "build",
      false,
      () => execute("del bin dist *.tgz", true),
      () => execute("webpack --mode=production", true),
    );

  if (core === "node")
    await run(
      "build",
      false,
      () => execute("del dist", true),
      () => execute("webpack --mode=production", true),
    );
}

build();
