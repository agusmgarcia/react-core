import run from "./_run";
import { execute } from "./utilities";

export default async function check(): Promise<void> {
  await run(
    false,
    () =>
      execute(
        "next lint --cache-location ./node_modules/.eslintcache --cache-strategy content --dir .",
        true,
      ),
    () =>
      execute(
        "prettier . --cache --cache-location ./node_modules/.prettiercache --cache-strategy content --config ./.prettierrc --check",
        true,
      ),
    () => execute("tsc --pretty --noEmit", true),
  );
}

check();
