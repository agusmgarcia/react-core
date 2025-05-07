import run from "./_run";
import { args, execute, getCore, getEnvFiles } from "./utils";

export default async function start(): Promise<void> {
  const core = await getCore();

  const port = args.get("port").find((_, i) => !i);
  const production = args.has("production");

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

  if (core === "node") {
    const envFiles = getEnvFiles(production ? "production" : "development")
      .map((path) => `--env-file=${path}`)
      .reverse()
      .join(" ");

    if (production) {
      await run(
        "start",
        false,
        () => execute("del dist", true),
        () => execute("webpack --mode=production", true),
        () =>
          execute(
            `node${!!envFiles ? ` ${envFiles}` : ""} dist/index.js`,
            true,
          ),
      );
    } else {
      await run(
        "start",
        false,
        () => execute("del dist", true),
        () => execute("webpack --mode=development", true),
        () =>
          execute(
            `concurrently -k "node${!!envFiles ? ` ${envFiles}` : ""} --watch dist/index.js" "webpack --mode=development --watch"`,
            true,
          ),
      );
    }
  }
}

start();
