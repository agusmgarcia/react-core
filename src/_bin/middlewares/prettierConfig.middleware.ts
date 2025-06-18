import { files } from "../utils";
import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<string>({
  path: "prettier.config.js",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function prettierConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([
    MIDDLEWARE(context),
    files.removeFile(".prettierrc"),
    files.removeFile(".prettierignore"),
    files.removeFile("prettier.config.mjs"),
    files.removeFile("prettier.config.ts"),
  ]);
}

function getTemplate(context: Context): string {
  return context.core === "app"
    ? `/** @type import("prettier").RequiredOptions */
module.exports = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "twMerge"],
  tailwindStylesheet: "./pages/_app.css",
};
`
    : context.core === "lib"
      ? `/** @type import("prettier").RequiredOptions */
module.exports = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "twMerge"],
  tailwindStylesheet: "./src/index.css",
};
`
      : `/** @type import("prettier").RequiredOptions */
module.exports = {};
`;
}
