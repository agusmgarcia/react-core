import run from "./_run";
import { execute, getCore } from "./utils";

export default async function build(): Promise<void> {
  const core = await getCore();

  if (core === "app")
    await run(
      false,
      () => execute("del .next out", true),
      () => execute("next build --no-lint", true),
    );

  if (core === "azure-func")
    await run(
      false,
      () => execute("del dist", true),
      () => execute("webpack --mode=production", true),
    );
}

build();
