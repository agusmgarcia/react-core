import { files, folders } from "../utils";
import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<string>({
  path: "next.config.js",
  template: getTemplate,
  valid: ["app"],
});

export default async function nextConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([
    MIDDLEWARE(context),
    files.removeFile("next.config.ts"),
    files.removeFile("next.config.mjs"),
  ]);

  if (context.core !== "app")
    context.defer(() => files.removeFile("next-env.d.ts"));
  else context.defer(() => folders.removeFolder(".next"));
}

function getTemplate() {
  return `const { PHASE_PRODUCTION_BUILD } = require("next/constants");

/** @type import('next').NextConfig */
module.exports = (phase) => ({
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  devIndicators: false,
  distDir: "dist",
  output: phase === PHASE_PRODUCTION_BUILD ? "export" : undefined,
  reactStrictMode: true,
});
`;
}
