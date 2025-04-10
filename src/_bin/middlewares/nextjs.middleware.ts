import { type AsyncFunc } from "#src/utils";

import { files, folders, getCore } from "../utils";

export default async function nextJSMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const core = await getCore();

  await Promise.all([
    folders.upsertFolder("pages").then(() =>
      Promise.all([
        core === "app"
          ? files.upsertFile("pages/_app.tsx", app, {
              create: regenerate && !ignore.includes("pages/_app.tsx"),
              update: false,
            })
          : files.removeFile("pages/_app.tsx"),
        core === "app"
          ? files.upsertFile("pages/_app.css", appCSS, {
              create: regenerate && !ignore.includes("pages/_app.css"),
              update: false,
            })
          : files.removeFile("pages/_app.css"),
      ]),
    ),
    core === "app"
      ? files.upsertFile(
          "next.config.js",
          nextConfig,
          regenerate && !ignore.includes("next.config.js"),
        )
      : files.removeFile("next.config.js"),
    files.removeFile(".env"),
    core === "app"
      ? files.upsertFile(".env.local", envLocal, {
          create: regenerate && !ignore.includes(".env.local"),
          update: false,
        })
      : files.removeFile(".env.local"),
  ]);

  try {
    await next();
  } finally {
    await Promise.all([
      core !== "app" ? files.removeFile("next-env.d.ts") : Promise.resolve(),
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
  basePath: process.env.BASE_PATH,
  devIndicators: false,
  output: phase === PHASE_PRODUCTION_BUILD ? "export" : undefined,
  reactStrictMode: true,
});
`;

const envLocal = "NEXT_PUBLIC_APP_VERSION=1.0.0";
