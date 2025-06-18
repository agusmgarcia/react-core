import run from "./_run";
import { execute, getPackageJSON } from "./utils";

export default async function build(): Promise<void> {
  const core = await getPackageJSON().then((json) => json.core);

  if (core === "app")
    await run(
      "build",
      () => execute("del dist", true),
      () => execute("next build --no-lint", true),
    );

  if (core === "azure-func")
    await run(
      "build",
      () => execute("del dist", true),
      () => execute("webpack --mode=production", true),
    );

  if (core === "lib")
    await run(
      "build",
      () => execute("del bin dist *.tgz", true),
      () => execute("webpack --mode=production", true),
    );

  if (core === "node")
    await run(
      "build",
      () => execute("del dist", true),
      () => execute("webpack --mode=production", true),
    );
}

build();
