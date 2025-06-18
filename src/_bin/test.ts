import run from "./_run";
import { args, execute } from "./utils";

export default async function test(): Promise<void> {
  const watch = args.has("watch");
  const pattern = args.get("pattern");

  await run("test", () =>
    execute(
      `jest --passWithNoTests${watch ? " --watch" : ""}${pattern.length ? ` ${pattern.join(" ")}` : ""}`,
      true,
    ),
  );
}

test();
