import run from "./_run";
import { args, execute } from "./utils";

export default async function test(): Promise<void> {
  const watch = args.has("watch");
  const pattern = args.get("pattern");

  await run(false, () =>
    execute(
      `jest --passWithNoTests${watch ? " --watch" : ""}${pattern.length ? ` ${pattern.join(" ")}` : ""}`,
      true,
    ).finally(() => execute("del .swc", true)),
  );
}

test();
