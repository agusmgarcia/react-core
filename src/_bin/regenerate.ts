import run from "./_run";
import { execute } from "./utils";

export default async function regenerate(): Promise<void> {
  console.log("Regenerating files...");
  await run(
    "regenerate",
    () => execute("del bin dist pages src *.tgz", true),
    () => execute("echo Files regenerated!", true),
  );
}

regenerate();
