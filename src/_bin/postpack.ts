import run from "./_run";
import { args, execute, isLibrary } from "./utils";

export default async function postpack(): Promise<void> {
  if (!(await isLibrary())) return;

  const simulated = args.has("simulated");

  await run(false, () =>
    execute(
      `del bin dist${simulated ? "" : " *.tgz"} README.md CHANGELOG.md`,
      true,
    ),
  );
}

postpack();
