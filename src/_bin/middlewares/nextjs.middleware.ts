import { type AsyncFunc } from "#src/utilities";

import { files, folders, isLibrary } from "../utilities";

export default async function nextJSMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const library = await isLibrary();

  await Promise.all([
    folders.upsertFolder("pages"),
    !library
      ? files.upsertFile(
          "next.config.js",
          nextConfig,
          regenerate && !ignore.includes("next.config.js"),
        )
      : Promise.resolve(),
    !library
      ? files.upsertFile(".env", env, {
          create: regenerate && !ignore.includes(".env"),
          update: false,
        })
      : Promise.resolve(),
    !library
      ? files.upsertFile(".env.local", envLocal, {
          create: regenerate && !ignore.includes(".env.local"),
          update: false,
        })
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

const nextConfig = `const { PHASE_PRODUCTION_BUILD } = require("next/constants");

/** @type import('next').NextConfig */
module.exports = (phase) => ({
  basePath: process.env.BASE_PATH,
  output: phase === PHASE_PRODUCTION_BUILD ? "export" : undefined,
  reactStrictMode: true,
});
`;

const env = "";

const envLocal = "NEXT_PUBLIC_APP_VERSION=1.0.0";
