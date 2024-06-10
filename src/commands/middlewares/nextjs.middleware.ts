import { type Func } from "../../utilities";
import {
  isLibrary,
  removeFile,
  removeFolder,
  upsertFile,
  upsertFolder,
} from "../utilities";

export default async function nextJSMiddleware(
  next: Func<[Promise<void>]>,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const library = await isLibrary();

  await Promise.all([
    upsertFolder("pages"),
    !library
      ? upsertFile(
          "next.config.js",
          nextConfig,
          regenerate && !ignore.includes("next.config.js"),
        )
      : Promise.resolve(),
    !library ? upsertFile(".env", env, false) : Promise.resolve(),
    !library ? upsertFile(".env.local", envLocal, false) : Promise.resolve(),
  ]);

  try {
    await next();
  } finally {
    await Promise.all([
      library ? removeFile("next-env.d.ts") : Promise.resolve(),
      library ? removeFolder(".next") : Promise.resolve(),
      library ? removeFolder("pages") : Promise.resolve(),
    ]);
  }
}

const nextConfig = `const { PHASE_PRODUCTION_BUILD } = require("next/constants");

/** @type {import('next').NextConfig} */
module.exports = (phase) => ({
  output: phase === PHASE_PRODUCTION_BUILD ? "export" : undefined,
  reactStrictMode: true,
});
`;

const env = "";

const envLocal = "NEXT_PUBLIC_APP_VERSION=1.0.0";
