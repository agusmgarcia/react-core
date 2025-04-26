import { EOL } from "os";

import { type AsyncFunc, merges } from "#src/utils";

import { files, folders, getCore, git } from "../utils";

export default async function nextJSMiddleware(
  command: string,
  next: AsyncFunc,
  regenerate: "hard" | "soft" | undefined,
  ignore: string[],
): Promise<void> {
  const core = await getCore();

  await Promise.all([
    core === "app" || command !== "start"
      ? folders.upsertFolder("pages").then(() =>
          Promise.all([
            core === "app"
              ? files.upsertFile("pages/_app.tsx", app, {
                  create: !!regenerate && !ignore.includes("pages/_app.tsx"),
                  update: false,
                })
              : files.removeFile("pages/_app.tsx"),
            core === "app"
              ? files.upsertFile("pages/_app.css", appCSS, {
                  create: !!regenerate && !ignore.includes("pages/_app.css"),
                  update: false,
                })
              : files.removeFile("pages/_app.css"),
          ]),
        )
      : folders.removeFolder("pages"),
    core === "app"
      ? files.upsertFile(
          "next.config.js",
          nextConfig,
          !!regenerate && !ignore.includes("next.config.js"),
        )
      : files.removeFile("next.config.js"),
    files.removeFile(".env"),
    core === "app" || core === "node"
      ? files.upsertFile(
          ".env.local",
          await createEnvLocalFile(core, regenerate),
          !!regenerate && !ignore.includes(".env.local"),
        )
      : files.removeFile(".env.local"),
  ]);

  try {
    await next();
  } finally {
    await Promise.all([
      core !== "app" ? files.removeFile("next-env.d.ts") : Promise.resolve(),
      core !== "app" ? folders.removeFolder("out") : Promise.resolve(),
      core !== "app" ? folders.removeFolder(".next") : Promise.resolve(),
      core !== "app" ? folders.removeFolder("pages") : Promise.resolve(),
    ]);
  }
}

const app = `import "./_app.css";

import { type AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component }: AppProps<any>) {
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <Component />
    </>
  );
}
`;

const appCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

const nextConfig = `const { PHASE_PRODUCTION_BUILD } = require("next/constants");

/** @type import('next').NextConfig */
module.exports = (phase) => ({
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  devIndicators: false,
  output: phase === PHASE_PRODUCTION_BUILD ? "export" : undefined,
  reactStrictMode: true,
});
`;

async function createEnvLocalFile(
  core: Extract<Awaited<ReturnType<typeof getCore>>, "app" | "node">,
  regenerate: "hard" | "soft" | undefined,
): Promise<string> {
  if (!regenerate) return "";

  const envLocal =
    regenerate === "soft"
      ? await files.readFile(".env.local").then((result) =>
          !!result
            ? result.split(EOL).reduce(
                (result, line) => {
                  const [key, value] = line.split("=", 2);
                  if (!key) return result;

                  result[key] = value || "";
                  return result;
                },
                {} as Record<string, string>,
              )
            : {},
        )
      : {};

  const version = await git.isInsideRepository().then((inside) =>
    inside
      ? git
          .getTags({ merged: true })
          .then((tags) => tags.at(-1))
          .then((tag) => git.getTagInfo(tag || "v0.0.0"))
          .then((info) => `${info.major}.${info.minor}.${info.patch}`)
      : "0.0.0",
  );

  const source =
    core === "app"
      ? {
          NEXT_PUBLIC_APP_VERSION: version,
          NEXT_PUBLIC_BASE_PATH: "",
        }
      : {
          APP_VERSION: version,
        };

  return Object.entries(merges.deep(envLocal, source, { sort: true })).reduce(
    (result, [key, value], index) =>
      `${result}${!!index ? EOL : ""}${key}=${value}`,
    "",
  );
}
