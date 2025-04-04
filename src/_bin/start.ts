import run from "./_run";
import { args, execute, getCore } from "./utils";

export default async function start(): Promise<void> {
  const core = await getCore();

  const port = args.get("port").find((_, i) => !i);

  if (core === "app")
    await run(false, () =>
      execute(`next dev${!!port ? ` --port ${port}` : ""}`, true),
    );

  if (core === "azure-func")
    await run(false, () =>
      execute(
        `concurrently -k "webpack --mode=development --watch" "func start --port=${port || 3000}"`,
        true,
      ),
    );
}

start();
