import run from "./_run";
import { execute } from "./utils";

export default async function regenerate(): Promise<void> {
  await execute("echo Regenerating files...", true);
  await run(true, () => Promise.resolve());
  await execute("npm run format", true);
  await execute("echo Files regenerated!", true);
}

regenerate();
