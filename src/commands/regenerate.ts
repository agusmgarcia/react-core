import run from "./_run";
import { execute } from "./utilities";

export default async function regenerate(): Promise<void> {
  await execute("echo Regenerating files...", true);
  await run(true, () => execute("echo Files regenerated!", true));
}

regenerate();
