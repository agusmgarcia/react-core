import run from "./_run";
import { args, execute, isLibrary } from "./utils";

export default async function start(): Promise<void> {
  if (await isLibrary()) return;

  const port = args.get("port").find((_, i) => !i);

  await run(false, () =>
    execute(`next dev${!!port ? ` --port ${port}` : ""}`, true),
  );
}

start();
