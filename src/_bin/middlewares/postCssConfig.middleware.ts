import { files } from "../utils";
import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<string>({
  path: "postcss.config.js",
  template: getTemplate,
  valid: ["app", "lib"],
});

export default async function postCssConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([
    MIDDLEWARE(context),
    files.removeFile("postcss.config.mjs"),
    files.removeFile("postcss.config.ts"),
  ]);
}
function getTemplate(): string {
  return `module.exports = {
  plugins: ["@tailwindcss/postcss"],
};
`;
}
