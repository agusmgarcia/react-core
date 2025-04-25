import run from "./_run";
import { execute } from "./utils";

export default async function regenerate(): Promise<void> {
  console.log("Regenerating files...");
  await run("regenerate", true, () => Promise.resolve());
  await execute("npm run format", true);
  console.log("Files regenerated!");
}

regenerate();
