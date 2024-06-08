import run from "./_run";
import { execute, isLibrary } from "./utilities";

export default async function start(): Promise<void> {
  if (await isLibrary()) return;

  await run(false, () => execute("next dev", true));
}

start();
