import run from "./_run";
import { args, execute } from "./utils";

export default async function test(): Promise<void> {
  const watch = args.has("watch");

  await run(false, () =>
    execute(`jest --passWithNoTests${watch ? " --watch" : ""}`, true).finally(
      () => execute("del .swc", true),
    ),
  );
}

test();
