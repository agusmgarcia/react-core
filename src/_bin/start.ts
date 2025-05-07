import run from "./_run";
import { args, execute, getCore } from "./utils";

export default async function start(): Promise<void> {
  const core = await getCore();

  const port = args.get("port").find((_, i) => !i);

  if (core === "app")
    await run("start", false, () =>
      execute(`next dev${!!port ? ` --port ${port}` : ""}`, true),
    );

  if (core === "azure-func")
    await run(
      "start",
      false,
      () => execute("del dist", true),
      () => execute("webpack --mode=development", true),
      () =>
        execute(
          `concurrently -k "func start --port=${port || 3000}" "webpack --mode=development --watch"`,
          true,
        ),
    );

  if (core === "node")
    await run(
      "start",
      false,
      () => execute("del dist", true),
      () => execute("webpack --mode=development", true),
      () =>
        execute(
          `concurrently -k "node --env-file-if-exists=.env.local --watch dist/index.js" "webpack --mode=development --watch"`,
          true,
        ),
    );
}

start();
