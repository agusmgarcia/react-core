import run from "./_run";
import { args, execute, getCore } from "./utils";

export default async function start(): Promise<void> {
  if ((await getCore()) !== "app") return;

  const port = args.get("port").find((_, i) => !i);

  await run(false, () =>
    execute(`next dev${!!port ? ` --port ${port}` : ""}`, true),
  );
}

start();
