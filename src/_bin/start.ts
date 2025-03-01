import run from "./_run";
import { execute, isLibrary } from "./utils";

export default async function start(): Promise<void> {
  if (await isLibrary()) return;

  const portRegexp = /--port=(\d+)/;

  const port = process.argv
    .filter((p) => portRegexp.test(p))
    .map((p) => +p.replace(portRegexp, "$1"))
    .find((_, i) => !i);

  await run(false, () =>
    execute(`next dev${!!port ? ` --port ${port}` : ""}`, true),
  );
}

start();
