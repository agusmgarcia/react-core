import run from "./_run";
import { execute, isLibrary } from "./utilities";

export default async function postpack(): Promise<void> {
  if (!(await isLibrary())) return;

  const simulated = !!process.argv.find((p) => p === "--simulated");

  await run(false, () =>
    execute(
      `del bin dist${simulated ? "" : " *.tgz"} README.md CHANGELOG.md`,
      true,
    ),
  );
}

postpack();
