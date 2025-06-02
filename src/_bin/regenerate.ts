import run from "./_run";
import { npm } from "./utils";

export default async function regenerate(): Promise<void> {
  console.log("Regenerating files...");
  await run("regenerate", true, () => Promise.resolve());
  await npm.format();
  console.log("Files regenerated!");
}

regenerate();
