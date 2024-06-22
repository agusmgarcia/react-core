import run from "./_run";
import { execute, isLibrary } from "./utilities";

export default async function build(): Promise<void> {
  if (await isLibrary()) return;

  await run(
    false,
    () => execute("del .next out", true),
    () => execute("next build --no-lint", true),
  );
}

build();
