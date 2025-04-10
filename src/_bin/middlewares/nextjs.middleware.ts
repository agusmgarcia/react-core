import { EOL } from "os";

import { type AsyncFunc, merges } from "#src/utils";

import { files, folders, git, isLibrary } from "../utils";

export default async function nextJSMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const library = await isLibrary();

  await Promise.all([
    folders.upsertFolder("pages").then(() =>
      Promise.all([
        !library
          ? files.upsertFile("pages/_app.tsx", app, {
              create: regenerate && !ignore.includes("pages/_app.tsx"),
              update: false,
            })
          : Promise.resolve(),
        !library
          ? files.upsertFile("pages/_app.css", appCSS, {
              create: regenerate && !ignore.includes("pages/_app.css"),
              update: false,
            })
          : Promise.resolve(),
      ]),
    ),
    !library
      ? files.upsertFile(
          "next.config.js",
          nextConfig,
          regenerate && !ignore.includes("next.config.js"),
        )
      : Promise.resolve(),
    files.removeFile(".env"),
    !library
      ? files.upsertFile(
          ".env.local",
          await createEnvLocalFile(),
          regenerate && !ignore.includes(".env.local"),
        )
      : Promise.resolve(),
  ]);

  try {
    await next();
  } finally {
    await Promise.all([
      library ? files.removeFile("next-env.d.ts") : Promise.resolve(),
      library ? folders.removeFolder(".next") : Promise.resolve(),
      library ? folders.removeFolder("pages") : Promise.resolve(),
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

async function createEnvLocalFile(): Promise<string> {
  const envLocal = await files.readFile(".env.local").then((result) =>
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
  );

  const source = {
    BASE_PATH: "",
    NEXT_PUBLIC_APP_VERSION: await git
      .getTags({ merged: true })
      .then((tags) => tags.at(-1))
      .then((tag) => git.getTagInfo(tag || "v0.0.0"))
      .then((info) => `${info.major}.${info.minor}.${info.patch}`),
  };

  return Object.entries(
    merges.deep(envLocal, source, {
      arrayConcat: true,
      arrayRemoveDuplicated: true,
      sort: true,
    }),
  ).reduce(
    (result, [key, value], index) =>
      `${result}${!!index ? EOL : ""}${key}=${value}`,
    "",
  );
}
