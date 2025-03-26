import run from "./_run";
import { execute, getCore } from "./utils";

export default async function build(): Promise<void> {
  if ((await getCore()) !== "app") return;

  await run(
    false,
    () => execute("del .next out", true),
    () => execute("next build --no-lint", true),
  );
}

build();
