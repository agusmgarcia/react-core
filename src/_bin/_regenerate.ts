import format from "./_format";
import run from "./_run";
import { execute } from "./utilities";

export default async function regenerate(): Promise<void> {
  await execute("echo Regenerating files...", true);
  await run(true, () => Promise.resolve());
  await format();
  await execute("echo Files regenerated!", true);
}
